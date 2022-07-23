package middlewares

import (
	"backend/db"
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/koron/go-dproxy"
)

func LoginCheckMiddleware() gin.HandlerFunc {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	var sessionKey = os.Getenv("SESSION_KEY")
	return func(ctx *gin.Context) {
		session := sessions.Default(ctx)
		loginUserJson, err := dproxy.New(session.Get(sessionKey)).String()

		if err != nil {
			ctx.Status(http.StatusUnauthorized)
			ctx.Abort()
		} else {
			var loginInfo db.Users
			err := json.Unmarshal([]byte(loginUserJson), &loginInfo)
			if err != nil {
				ctx.Status(http.StatusUnauthorized)
				ctx.Abort()
			} else {
				ctx.Next()
			}
		}
	}
}