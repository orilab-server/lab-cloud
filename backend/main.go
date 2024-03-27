package main

import (
	"backend/db"
	"backend/docs"
	"backend/features/auth"
	"backend/features/filesystem"
	"backend/features/trash"
	"backend/features/user"
	"backend/middlewares"
	"backend/tools"
	"database/sql"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	myDB, err := db.Init()
	if err != nil {
		panic(err)
	}
	defer func(myDB *sql.DB) {
		err := myDB.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(myDB)
	sessionKey := os.Getenv("SESSION_KEY")
	serverPort := os.Getenv("SERVER_PORT")
	shareDirPath := os.Getenv("SHARE_DIR")
	trashDirPath := os.Getenv("TRASH_DIR_PATH")
	siteUrl := os.Getenv("SITE_URL")
	secret := os.Getenv("SECRET")
	mailName := os.Getenv("MAIL_NAME")
	from := os.Getenv("MAIL_FROM")
	to := os.Getenv("MAIL_TO")
	teacher := os.Getenv("MAIL_TEACHER_ADDRESS")
	mailPassword := os.Getenv("MAIL_PASSWORD")
	smtpServ := os.Getenv("SMTP_SERVER")
	smtpPort := os.Getenv("SMTP_PORT")
	importantDirStr := os.Getenv("IMPORTANT_DIRS")
	//lineNotifyToken := os.Getenv("LINE_NOTIFY_TOKEN")
	router := gin.New()
	docs.SwaggerInfo.BasePath = "/api"
	server := &http.Server{
		Addr:    ":" + serverPort,
		Handler: router,
	}
	router.Use(middlewares.CorsMiddleWare(siteUrl))
	store := cookie.NewStore([]byte(secret))
	mailInfo := tools.MailRequest{Name: mailName, From: from, To: to, Teacher: teacher, Password: mailPassword, SmtpSrv: smtpServ, SmtpPort: smtpPort}
	authController := auth.Controller{MyDB: myDB, SessionKey: sessionKey, MailInfo: mailInfo, SiteUrl: siteUrl + "/login"}
	userController := user.UserController{ShareDir: shareDirPath, MyDB: myDB, SessionKey: sessionKey, Url: siteUrl, MailInfo: mailInfo}
	router.Use(sessions.Sessions(sessionKey, store))
	apiGrp := router.Group("/api")

	apiGrp.POST("/login", authController.Login)
	apiGrp.GET("/user", userController.GetUser)
	apiGrp.POST("/reset-password", userController.ResetPasswordRequest)
	apiGrp.PUT("/reset-password", userController.ResetPassword)
	apiGrp.POST("/register-requests", authController.PostRequestRegister)
	apiGrp.GET("/register-requests", authController.GetRegisterRequests)

	authGrp := apiGrp.Group("/auth")
	//authGrp.Use(middlewares.LoginCheckMiddleware(sessionKey))
	{
		importantDirs := strings.Split(importantDirStr, "/")
		fsController := filesystem.Controller{ShareDir: shareDirPath, TrashDir: trashDirPath, ImportantDirs: importantDirs, MyDB: myDB}
		trashController := trash.Controller{ShareDir: shareDirPath, TrashDir: trashDirPath, ImportantDirs: importantDirs, MyDB: myDB}

		filesystemGrp := authGrp.Group("/filesystem")
		{
			filesystemGrp.GET("/:dirId", fsController.GetFileSystemObjects)
			filesystemGrp.POST("/:dirId", fsController.CreateDir)
			filesystemGrp.PUT("/rename/:id", fsController.ChangeName)
			filesystemGrp.PUT("/:dirId/location", fsController.MoveDir)
			filesystemGrp.POST("/upload/:dirId/files", fsController.UploadFiles)
			filesystemGrp.POST("/upload/:dirId/dir", fsController.UploadDir)
			filesystemGrp.GET("/download/files", fsController.DownloadFile)
			filesystemGrp.GET("/download/dirs/:dirId", fsController.DownloadDir)
		}

		trashGrp := authGrp.Group("/trashes")
		{
			trashGrp.GET("", trashController.GetTrashes)
			trashGrp.POST("", trashController.MoveToTrash)
			trashGrp.DELETE("", trashController.DeleteObjects)
			trashGrp.GET("/:dirId", trashController.GetTrashesInDir)
			trashGrp.POST("/restore", trashController.RestoreObjects)
		}

		usersGrp := apiGrp.Group("/users")
		{
			usersGrp.GET("", userController.GetUsers)
			usersGrp.PATCH("/:userId/password", userController.ChangePassword)
			usersGrp.PATCH("/:userId/rename", userController.ChangeUsername)
		}

		authGrp.POST("/accept-register", authController.AcceptRegisterRequests)
		authGrp.GET("/logout", authController.Logout)
	}
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
