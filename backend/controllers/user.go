package controllers

import (
	"backend/db"
	users_table "backend/db/users"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/koron/go-dproxy"
	"golang.org/x/crypto/bcrypt"
)

type UserController struct {
	MyDB       *sql.DB
	ShareDir   string
	SessionKey string
}

var loginUser db.Users

func (u UserController) GetUserController(ctx *gin.Context) {
	session := sessions.Default(ctx)
	jsonLoginUser, err := dproxy.New(session.Get(u.SessionKey)).String()
	if err != nil {
		ctx.Status(http.StatusUnauthorized)
		return
	}
	json.Unmarshal([]byte(jsonLoginUser), &loginUser)
	user, err := users_table.SelectRow(u.MyDB, db.SelectQueryParam{From: "users", Column: []string{"name", "is_temporary"}, Where: map[string]any{"email": loginUser.Email}})
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
	}
	ctx.JSON(http.StatusOK, gin.H{
		"name":         user.Name,
		"is_temporary": user.IsTemporary,
	})
}

func (u UserController) PatchUserController(ctx *gin.Context) {
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
	if _, err := users_table.UpdateRow(u.MyDB, db.UpdateQueryParam{From: "users", Set: map[string]any{"password": string(hashed), "is_temporary": false}, Where: map[string]any{"email": loginUser.Email}}); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "user not found",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "successfully update",
	})
}
