package user

import (
	"backend/models"
	"backend/tools"
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
	"golang.org/x/crypto/bcrypt"
)


func (u UserController) ResetPasswordRequest(ctx *gin.Context) {
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

func (u UserController) ResetPassword(ctx *gin.Context) {
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