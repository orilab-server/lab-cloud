package auth

import (
	"backend/models"
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (a Authcontroller) Login(ctx *gin.Context) {
	email := strings.TrimSpace(ctx.PostForm("email"))
	password := strings.TrimSpace(ctx.PostForm("password"))
	if email == "" || password == "" {
		ctx.Status(http.StatusBadRequest)
	} else {
		m_ctx := context.Background()
		user, err :=  models.Users(models.UserWhere.Email.EQ(email)).One(m_ctx, a.MyDB)
		if err != nil {
			ctx.Status(http.StatusBadRequest)
			return
		}
		// compare with hash and pass
		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Wrong password",
			})
		} else {
			session := sessions.Default(ctx)
			loginUser, err := json.Marshal(user)
			if err == nil {
				session.Set(a.SessionKey, string(loginUser))
				session.Save()
				ctx.JSON(http.StatusOK, gin.H{
					"message": "Successfully logged in",
				})
			} else {
				ctx.Status(http.StatusInternalServerError)
			}
		}
	}
}