package controllers

import (
	"backend/models"
	mailservice "backend/service/mail_service"
	"backend/tools"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/koron/go-dproxy"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
	"golang.org/x/crypto/bcrypt"
)

type UserController struct {
	MyDB       *sql.DB
	ShareDir   string
	SessionKey string
	Url string
	MailInfo mailservice.MailRequest
}

var loginUser models.User

func (u UserController) GetUsersController(ctx *gin.Context) {
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

func (u UserController) GetUserController(ctx *gin.Context) {
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
	user, err :=  models.Users(models.UserWhere.Email.EQ(loginUser.Email)).One(m_ctx, u.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
	}
	ctx.JSON(http.StatusOK, gin.H{
		"is_login":     true,
		"id":           user.ID,
		"name":         user.Name,
		"grade":        user.Grade,
		"is_temporary": user.IsTemporary,
	})
}

func (u UserController) PatchPasswordController(ctx *gin.Context) {
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

func (u UserController) UserRenameController(ctx *gin.Context) {
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

func (u UserController) ResetPasswordRequestController(ctx *gin.Context) {
	email := strings.TrimSpace(ctx.PostForm("email"))
	if email == "" {
		ctx.Status(http.StatusBadRequest)
		return
	}
	modelCtx := context.Background()
	userExist, _ := models.Users(qm.Where("email=?", email)).Exists(modelCtx, u.MyDB)
	if !userExist {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "user not found",
		})
		return
	}
	// dbにパスワードリセット用tokenを登録
	id, _ := uuid.NewUUID()
	token, _ := tools.GetRandomStr(254)
	resetToken := models.ResetToken{
		ID: id.String(),
		Email: email,
		Token: token,
	}
	if err := resetToken.Insert(modelCtx, u.MyDB, boil.Infer()); err != nil {
		log.Fatal(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	// リセット用リンクメールを送信
	msg := []byte(""+
			"From: " + u.MailInfo.From + "\r\n" +
			"To: " + u.MailInfo.To + "\r\n" +
			"Subject: [件名] パスワード変更メール" + 
			"\r\n" +
			"\r\n" +
			"============================" +
			"\r\n" +
			"\r\n" +
			"こちらのリンクからパスワードを変更してください" +
			"\r\n" +
			u.Url + "/reset-password?token=" + token +
			"\r\n" +
			"\r\n" +
			"※このリンクにアクセスするには大学のネットワークに接続している必要があります" +
			"\r\n" +
	"")
  if err := u.MailInfo.SendOptional(msg, email); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "mail send error",
		})
	}
}

func (u UserController) ResetPasswordController(ctx *gin.Context) {
	token := strings.TrimSpace(ctx.PostForm("token"))
	newPassword := strings.TrimSpace(ctx.PostForm("newPassword"))
	if token == "" {
		ctx.Status(http.StatusBadRequest)
		return
	}
	if newPassword == "" {
		ctx.Status(http.StatusBadRequest)
		return
	}
	modelCtx := context.Background()
	tokens, err := models.ResetTokens(qm.Where("token=?", token)).One(modelCtx, u.MyDB)
	if err != nil || (tokens.ID == "" && tokens.Email == "") {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid token",
		})
		return
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), 10)
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}
	if _, err := models.Users(qm.Where("email=?", tokens.Email)).UpdateAll(modelCtx, u.MyDB, models.M{"password": string(hashed)}); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "user not found",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "successfully reset password",
	})
	// 使用済みトークンは削除
	models.ResetTokens(qm.Where("id=?", tokens.ID)).DeleteAll(modelCtx, u.MyDB)
}