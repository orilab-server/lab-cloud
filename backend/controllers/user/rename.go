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
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (u UserController) UserRename(ctx *gin.Context) {
	newName := strings.TrimSpace(ctx.PostForm("newName"))
	if newName == "" {
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
	modelCtx := context.Background()
	if _, err := models.Users(qm.Where("email=?", loginUser.Email)).UpdateAll(modelCtx, u.MyDB, models.M{"name": newName}); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "user not found",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "successfully update username",
	})
}
