package main

import (
	"backend/controllers/auth"
	"backend/controllers/download"
	"backend/controllers/home"
	"backend/controllers/mail"
	"backend/controllers/reviews"
	"backend/controllers/upload"
	"backend/controllers/user"
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
	mailName := os.Getenv("MAIL_NAME")
	from := os.Getenv("MAIL_FROM")
	to := os.Getenv("MAIL_TO")
	teacher := os.Getenv("MAIL_TEACHER_ADDRESS")
	mailPassword := os.Getenv("MAIL_PASSWORD")
	smtpServ := os.Getenv("SMTP_SERVER")
	smtpPort := os.Getenv("SMTP_PORT")
	importantDirStr := os.Getenv("IMPORTANT_DIRS")
	lineNotifyToken := os.Getenv("LINE_NOTIFY_TOKEN")
	modelContext := context.Background()
	router := gin.New()
	server := &http.Server{
		Addr:    ":" + serverPort,
		Handler: router,
	}
	router.Static("/_next", "out/_next")
	router.StaticFile("/out/favicon.ico", "./out/favicon.ico")
	router.LoadHTMLGlob("out/*.html")
	router.Use(middlewares.CorsMiddleWare(siteUrl))
	store := cookie.NewStore([]byte(secret))
	mailInfo := mailservice.MailRequest{Name: mailName, From: from, To: to, Teacher: teacher, Password: mailPassword, SmtpSrv: smtpServ, SmtpPort: smtpPort}
	sender := mail.SendController{MailInfo: mailInfo}
	auth := auth.Authcontroller{MyDB: myDB, SessionKey: sessionKey, MailInfo: mailInfo, SiteUrl: siteUrl+"/login"}
	user := user.UserController{ShareDir: shareDirPath, MyDB: myDB, SessionKey: sessionKey, Url: siteUrl, MailInfo: mailInfo}
	router.Use(sessions.Sessions("mysession", store))

	/*
	* Static HTML files
	*/ 
	// 404
	router.NoRoute(func(ctx *gin.Context) {
		ctx.HTML(200, "404.html", nil)
	})
	// home
	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(200, "index.html", nil)
	})
	// login
	router.GET("/login", func(ctx *gin.Context) {
		ctx.HTML(200, "login.html", nil)
	})
	// admin
	router.GET("/admin", func(ctx *gin.Context) {
		ctx.HTML(200, "admin.html", nil)
	})
	router.GET("/admin/login", func(ctx *gin.Context) {
		ctx.HTML(200, "login.html", nil)
	})
	router.GET("/admin/[collection]", func(ctx *gin.Context) {
		ctx.HTML(200, "[collection].html", nil)
	})
	// reviews
	router.GET("/reviews", func(ctx *gin.Context) {
		ctx.HTML(200, "reviews.html", nil)
	})
	router.GET("/reviews/[review_id]", func(ctx *gin.Context) {
		ctx.HTML(200, "[review_id].html", nil)
	})
	router.GET("/reviews/[review_id]/[reviewed_id]", func(ctx *gin.Context) {
		ctx.HTML(200, "[reviewed_id].html", nil)
	})
	// profile
	router.GET("/profile", func(ctx *gin.Context) {
		ctx.HTML(200, "profile.html", nil)
	})
	// reset-password
	router.GET("/reset-password", func(ctx *gin.Context) {
		ctx.HTML(200, "reset-password.html", nil)
	})
	router.GET("/reset-password/request", func(ctx *gin.Context) {
		ctx.HTML(200, "request.html", nil)
	})

	/*
	* APIs
	*/
	router.GET("/user", user.GetUser)
	router.POST("/user/reset-password/request", user.ResetPasswordRequest)
	router.PATCH("/user/reset-password", user.ResetPassword)
	router.POST("/send", sender.SendMail)
	router.POST("/login", auth.Login)
	router.POST("/register-requests", auth.RequestRegister)
	// basic認証を要する
	adminGroup := router.Group("/admin", gin.BasicAuth(gin.Accounts{
		os.Getenv("ADMIN_NAME"): os.Getenv("ADMIN_PASS"),
	}))
	adminGroup.POST("/accept-register", auth.SignUp)
	adminGroup.GET("/register-requests", auth.GetRegisterRequests)

	authGroup := router.Group("/auth")
	authGroup.Use(middlewares.LoginCheckMiddleware(sessionKey))
	{
		importantDirs := strings.Split(importantDirStr, "/")
		home := home.HomeController{ShareDir: shareDirPath, TrashDir: trashDirPath, ImportantDirs: importantDirs, MyDB: myDB}
		download := download.DownloadController{ShareDir: shareDirPath}
		upload := upload.UploadController{ShareDir: shareDirPath}

		// homeエンドポイント
		homeGroup := authGroup.Group("/home")
		{
			homeGroup.GET("/", home.Main)
			homeGroup.GET("/trash", home.GetTrash)
			homeGroup.GET("/trash/:dir", home.GetFilesInDir)
			homeGroup.POST("/trash/files/dump", home.DumpFiles)
			homeGroup.POST("/trash/dirs/dump", home.DumpDirs)
			homeGroup.POST("/trash/files/restore", home.RestoreItems)
			homeGroup.POST("/trash/files/remove", home.RemoveAll)
		}
		
		// userエンドポイント
		authGroup.GET("/users", user.GetUsers)
		authGroup.PATCH("/user/password", user.ChangePassword)
		authGroup.PATCH("/user/rename", user.UserRename)
		// logoutエンドポイント
		authGroup.GET("/logout", auth.Logout)
		// downloadエンドポイント
		authGroup.GET("/download", download.Download)
		// uploadエンドポイント
		authGroup.POST("/upload", upload.Upload)
		// reuestエンドポイント
		requestGroup := authGroup.Group("/request")
		{
			requestGroup.GET("/mkdir", home.MkDir)
			requestGroup.GET("/rename", home.Rename)
		}

		reviews := reviews.ReviewsController{
			MyDB: myDB,
			ModelCtx: modelContext,
			ReviewDirPath: reviewDirPath,
			LineNotifyToken: lineNotifyToken,
			MailInfo: mailInfo,
		}
		// reviewエンドポイント
		reviewsGroup := authGroup.Group("/reviews")
		{
			// reviewsGroup.GET("/user/:user-id", reviews)
			reviewsGroup.GET("/", reviews.GetReviews) // レビュー全件取得
			reviewsGroup.POST("/", reviews.PostReview) // 新規レビュー作成
			reviewedGroup := reviewsGroup.Group("/:review-id/reviewed")
			{
				reviewedGroup.GET("/", reviews.GetReviewed) // 全レビュー対象者の未確認フィードバック数を返却
				reviewedGroup.GET("/:reviewed-id/files", reviews.GetFiles) // レビュー対象ファイル全件取得
				reviewedGroup.GET("/:reviewed-id/teacher/files", reviews.GetTeacherFiles) // レビュー対象ファイル全件取得
				reviewedGroup.POST("/:reviewed-id/files/upload", reviews.Upload) // 新しいファイルをアップロード
				reviewedGroup.POST("/:reviewed-id/teacher/files/upload", reviews.UploadTeacherReviewedFile) // 新しいファイルをアップロード
				reviewedGroup.GET("/:reviewed-id/files/:file-id/download", reviews.Download) // ファイルをダウンロード
				reviewedGroup.POST("/:reviewed-id/files/:file-id/comment", reviews.PostComment) // ファイルへのコメントのPOST
				reviewedGroup.POST("/:reviewed-id/files/:file-id/reviewer", reviews.PostRegisterReviewer) // ファイルへのレビュアーを登録
				reviewedGroup.GET("/:reviewed-id/files/:file-id/reviewers", reviews.GetReviewers) // ファイルへのレビューをした人の情報を全取得
				reviewedGroup.POST("/:reviewed-id/files/:file-id/reviewers/:reviewer-id/share", reviews.PostShareReview) // レビューをメールで通知
				reviewedGroup.GET("/:reviewed-id/files/:file-id/reviewers/:reviewer-id/comment/:page-number", reviews.GetComment) // ファイルへのレビューコメントを1件取得
			}
		}
	}
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
