package main

import (
	"backend/controllers"
	"backend/middlewares"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	// 暫定
	sharedir := home + "/Desktop/Laboratory"
	engine := gin.Default()
	engine.Use(middlewares.CorsMiddleWare())

	post := controllers.PostController{ShareDir: sharedir}
	get := controllers.GetController{ShareDir: sharedir}
	download := controllers.DownloadController{ShareDir: sharedir}

	engine.GET("/", get.Controller)
	engine.GET("/download", download.Controller)
	engine.POST("/",post.Controller)
	engine.Run(":8000")
}