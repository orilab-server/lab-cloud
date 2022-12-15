package main

import (
	"backend/controllers"
	"backend/controllers/reviews"
	"backend/db"
	"backend/middlewares"
	mailservice "backend/service/mail_service"
	"context"
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
	reviewDirPath := os.Getenv("REVIEW_DIR_PATH")
	siteUrl := os.Getenv("SITE_URL")
	secret := os.Getenv("SECRET")
	from := os.Getenv("MAIL_FROM")
	to := os.Getenv("MAIL_TO")
	mailPassword := os.Getenv("MAIL_PASSWORD")
	smtpServ := os.Getenv("SMTP_SERVER")
	smtpPort := os.Getenv("SMTP_PORT")
	importantDirStr := os.Getenv("IMPORTANT_DIRS")
	modelContext := context.Background()
	router := gin.New()
	server := &http.Server{
		Addr:    ":" + serverPort,
		Handler: router,
	}
	router.Static("/_next", "_next")
	router.LoadHTMLGlob("./*.html")
	router.Use(middlewares.CorsMiddleWare(siteUrl))
	store := cookie.NewStore([]byte(secret))
	mailInfo := mailservice.MailRequest{From: from, To: to, Password: mailPassword, SmtpSrv: smtpServ, SmtpPort: smtpPort}
	sender :=controllers.SendController{MailInfo: mailInfo}
	auth := controllers.Authcontroller{MyDB: myDB, SessionKey: sessionKey, MailInfo: mailInfo, SiteUrl: siteUrl+"/login"}
	user := controllers.UserController{ShareDir: shareDirPath, MyDB: myDB, SessionKey: sessionKey, Url: siteUrl, MailInfo: mailInfo}
	router.Use(sessions.Sessions("mysession", store))
	// ログイン・ホームページの静的ファイルを返す
	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(200, "index.html", nil)
	})
	router.GET("/login", func(ctx *gin.Context) {
		ctx.HTML(200, "login.html", nil)
	})
	router.GET("/user", user.GetUserController)
	router.POST("/user/reset-password/request", user.ResetPasswordRequestController)
	router.PATCH("/user/reset-password", user.ResetPasswordController)
	router.POST("/send", sender.MailController)
	router.POST("/login", auth.LoginController)

	router.POST("/register-requests", auth.RequestRegister)
	// basic認証を要する
	adminGroup := router.Group("/admin", gin.BasicAuth(gin.Accounts{
		os.Getenv("ADMIN_NAME"): os.Getenv("ADMIN_PASS"),
	}))
	adminGroup.POST("/accept-register", auth.SignUpController)
	adminGroup.GET("/register-requests", auth.GetRegisterRequests)

	authGroup := router.Group("/home")
	authGroup.Use(middlewares.LoginCheckMiddleware(sessionKey))
	{
		importantDirs := strings.Split(importantDirStr, "/")
		home := controllers.HomeController{ShareDir: shareDirPath, TrashDir: trashDirPath, ImportantDirs: importantDirs, MyDB: myDB}
		download := controllers.DownloadController{ShareDir: shareDirPath}
		upload := controllers.UploadController{ShareDir: shareDirPath}
		request := controllers.RequestController{ShareDir: shareDirPath, TrashDir: trashDirPath, ImportantDirs: importantDirs, MyDB: myDB}
		
		// userエンドポイント
		authGroup.GET("/users", user.GetUsersController)
		authGroup.PATCH("/user/password", user.PatchPasswordController)
		authGroup.PATCH("/user/rename", user.UserRenameController)
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
		reviews := reviews.ReviewsController{MyDB: myDB, ModelCtx: modelContext, ReviewDirPath: reviewDirPath}
		// reviewエンドポイント
		reviewsGroup := authGroup.Group("/reviews")
		{
			// reviewsGroup.GET("/user/:user-id", reviews)
			reviewsGroup.GET("/", reviews.GetReviewsController) // レビュー全件取得
			reviewsGroup.POST("/", reviews.PostReviewController) // 新規レビュー作成
			reviewedGroup := reviewsGroup.Group("/:review-id/reviewed")
			{
				reviewedGroup.GET("/", reviews.GetReviewedController) // 全レビュー対象者の未確認フィードバック数を返却
				reviewedGroup.GET("/:reviewed-id/files", reviews.GetFilesController) // レビュー対象ファイル全件取得
				reviewedGroup.POST("/:reviewed-id/files/upload", reviews.UploadController) // 新しいファイルをアップロード
				reviewedGroup.GET("/:reviewed-id/files/:file-id/download", reviews.DownloadController) // ファイルをダウンロード
				reviewedGroup.POST("/:reviewed-id/files/:file-id/comment", reviews.PostCommentController) // ファイルへのコメントのPOST
				reviewedGroup.GET("/:reviewed-id/files/:file-id/reviewers", reviews.GetReviewersController) // ファイルへのレビューをした人の情報を全取得
				reviewedGroup.GET("/:reviewed-id/files/:file-id/reviewers/:reviewer-id/comment/:page-number", reviews.GetCommentController) // ファイルへのレビューコメントを1件取得
			}
		}
	}
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
