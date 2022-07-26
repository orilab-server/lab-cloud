package main

import (
	"backend/controllers"
	"backend/db"
	"backend/middlewares"
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
	// 暫定
	sharedir := home + "/Desktop"
	router := gin.New()
	router.Use(middlewares.CorsMiddleWare())

	sessionKey := os.Getenv("SESSION_KEY")
	auth := controllers.Authcontroller{MyDB: myDB,SessionKey: sessionKey}
	store := cookie.NewStore([]byte("secret"))
	router.Use(sessions.Sessions("mysession", store))
	router.POST("/login", auth.LoginController)
	router.POST("/signup/"+os.Getenv("SIGNUP_ROUTE"), auth.SignUpController)
	
	authGroup := router.Group("/home")
	authGroup.Use(middlewares.CorsMiddleWare())
	authGroup.Use(middlewares.LoginCheckMiddleware(sessionKey)) 
	{
		upload := controllers.UploadController{ShareDir: sharedir}
		home := controllers.HomeController{ShareDir: sharedir}
		download := controllers.DownloadController{ShareDir: sharedir}
		user := controllers.UserController{ShareDir: sharedir,MyDB: myDB,SessionKey: sessionKey}
		authGroup.GET("/", home.Controller)
		authGroup.GET("/user", user.GetUserController)
		authGroup.PATCH("/user", user.PatchUserController)
		authGroup.GET("/download", download.Controller)
		authGroup.POST("/upload", upload.Controller)
		authGroup.GET("/logout", auth.LogoutController)
	}
	router.Run(":8000")
}
