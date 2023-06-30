package user

import (
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/koron/go-dproxy"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (u UserController) GetUsers(ctx *gin.Context) {
	users, err := models.Users(qm.Select("id", "name", "email", "grade", "is_temporary")).All(context.Background(), u.MyDB)
	if err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func (u UserController) GetUser(ctx *gin.Context) {
	session := sessions.Default(ctx)
	jsonLoginUser, err := dproxy.New(session.Get(u.SessionKey)).String()
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"is_login": false,
		})
		return
	}
	json.Unmarshal([]byte(jsonLoginUser), &loginUser)
	m_ctx := context.Background()
	user, err := models.Users(models.UserWhere.Email.EQ(loginUser.Email)).One(m_ctx, u.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
	}
	ctx.JSON(http.StatusOK, gin.H{
		"is_login":     true,
		"id":           user.ID,
		"name":         user.Name,
		"email":        user.Email,
		"grade":        user.Grade,
		"is_temporary": user.IsTemporary,
	})
}
