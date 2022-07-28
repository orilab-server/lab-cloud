package main

import (
	"backend/controllers"
	"backend/db"
	"backend/middlewares"
	"log"
	"net/http"
	"os"

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
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	sessionKey := os.Getenv("SESSION_KEY")
	siteUrl := os.Getenv("SITE_URL")
	serverPort := os.Getenv("SERVER_PORT")
	shareDir := os.Getenv("SHARE_DIR")
	shareDirPath := home + "/" + shareDir
	router := gin.New()
	server := &http.Server{
		Addr:    ":" + serverPort,
		Handler: router,
	}
	router.Use(middlewares.CorsMiddleWare(siteUrl))
	store := cookie.NewStore([]byte("secret"))

	auth := controllers.Authcontroller{MyDB: myDB, SessionKey: sessionKey}
	user := controllers.UserController{ShareDir: shareDirPath, MyDB: myDB, SessionKey: sessionKey}
	router.Use(sessions.Sessions("mysession", store))
	router.GET("/user", user.GetUserController)
	router.POST("/login", auth.LoginController)
	router.POST("/signup/"+os.Getenv("SIGNUP_ROUTE"), auth.SignUpController)

	authGroup := router.Group("/home")
	authGroup.Use(middlewares.LoginCheckMiddleware(sessionKey))
	{
		upload := controllers.UploadController{ShareDir: shareDirPath}
		home := controllers.HomeController{ShareDir: shareDirPath}
		download := controllers.DownloadController{ShareDir: shareDirPath}
		authGroup.GET("/", home.Controller)
		authGroup.PATCH("/user", user.PatchUserController)
		authGroup.GET("/download", download.Controller)
		authGroup.POST("/upload", upload.Controller)
		authGroup.GET("/logout", auth.LogoutController)
	}
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
