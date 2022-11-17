package main

import (
	"backend/controllers"
	"backend/db"
	"backend/middlewares"
	mailservice "backend/service/mail_service"
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
	defer myDB.Close()
	sessionKey := os.Getenv("SESSION_KEY")
	serverPort := os.Getenv("SERVER_PORT")
	shareDirPath := os.Getenv("SHARE_DIR")
	trashDirPath := os.Getenv("TRASH_DIR_PATH")
	siteUrl := os.Getenv("SITE_URL")
	secret := os.Getenv("SECRET")
	from := os.Getenv("MAIL_FROM")
	to := os.Getenv("MAIL_TO")
	mailPassword := os.Getenv("MAIL_PASSWORD")
	smtpServ := os.Getenv("SMTP_SERVER")
	smtpPort := os.Getenv("SMTP_PORT")
	importantDirStr := os.Getenv("IMPORTANT_DIRS")
	router := gin.New()
	server := &http.Server{
		Addr:    ":" + serverPort,
		Handler: router,
	}
	router.Static("/_next", "_next")
	router.LoadHTMLGlob("./*.html")
	router.Use(middlewares.CorsMiddleWare(siteUrl))
	store := cookie.NewStore([]byte(secret))

	sender :=controllers.SendController{MailInfo: mailservice.MailRequest{From: from, To: to, Password: mailPassword, SmtpSrv: smtpServ, SmtpPort: smtpPort}}
	auth := controllers.Authcontroller{MyDB: myDB, SessionKey: sessionKey}
	user := controllers.UserController{ShareDir: shareDirPath, MyDB: myDB, SessionKey: sessionKey}
	router.Use(sessions.Sessions("mysession", store))
	// ログイン・ホームページの静的ファイルを返す
	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(200, "index.html", nil)
	})
	router.GET("/login", func(ctx *gin.Context) {
		ctx.HTML(200, "login.html", nil)
	})
	router.GET("/user", user.GetUserController)
	router.POST("/send", sender.MailController)
	router.POST("/login", auth.LoginController)
	router.POST("/signup/"+os.Getenv("SIGNUP_ROUTE"), auth.SignUpController)

	authGroup := router.Group("/home")
	authGroup.Use(middlewares.LoginCheckMiddleware(sessionKey))
	{
		importantDirs := strings.Split(importantDirStr, "/")
		home := controllers.HomeController{ShareDir: shareDirPath, TrashDir: trashDirPath, ImportantDirs: importantDirs, MyDB: myDB}
		download := controllers.DownloadController{ShareDir: shareDirPath}
		upload := controllers.UploadController{ShareDir: shareDirPath}
		request := controllers.RequestController{ShareDir: shareDirPath, TrashDir: trashDirPath, ImportantDirs: importantDirs, MyDB: myDB}
		
		// userエンドポイント
		authGroup.PATCH("/user", user.PatchUserController)
		// logoutエンドポイント
		authGroup.GET("/logout", auth.LogoutController)
		// homeエンドポイント
		authGroup.GET("/", home.Controller)
		// downloadエンドポイント
		authGroup.GET("/download", download.Controller)
		// uploadエンドポイント
		authGroup.POST("/upload", upload.Controller)
		// reuestエンドポイント
		requestGroup := authGroup.Group("/request")
		{
			requestGroup.GET("/mkdir", request.MkDirController)
			requestGroup.GET("/rename", request.RenameController)
			requestGroup.GET("/mv", request.MvController)
			requestGroup.GET("/mv-trash", request.MvTrashController)
			requestGroup.GET("/rm-file", request.RmFileController)
			requestGroup.GET("/rm-dir", request.RmDirController)
		}
	}
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
