package user

import (
	"backend/models"
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/koron/go-dproxy"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
	"golang.org/x/crypto/bcrypt"
)

func (u UserController) ChangePassword(ctx *gin.Context) {
	newPassword := strings.TrimSpace(ctx.PostForm("newPassword"))
	if newPassword == "" {
		ctx.Status(http.StatusBadRequest)
		return
	}
	session := sessions.Default(ctx)
	jsonLoginUser, err := dproxy.New(session.Get(u.SessionKey)).String()
	if err != nil {
		ctx.Status(http.StatusUnauthorized)
		return
	}
	json.Unmarshal([]byte(jsonLoginUser), &loginUser)
	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), 10)
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}
	modelCtx := context.Background()
	user, _ := models.Users(qm.Where("email=?", loginUser.Email)).One(modelCtx, u.MyDB)
	user.Password = string(hashed)
	user.IsTemporary = false
	if _, err := user.Update(modelCtx, u.MyDB, boil.Infer()); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "user not found",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "successfully update",
	})
}