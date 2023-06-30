package auth

import (
	"backend/models"
	"backend/tools"
	"context"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"golang.org/x/crypto/bcrypt"
)

// admin registerd -> make user change the password
func (a Authcontroller) SignUp(ctx *gin.Context) {
	randStr, err := tools.GetRandomStr(10)
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}
	tempPassword := []byte(randStr)
	hashed, err := bcrypt.GenerateFromPassword(tempPassword, 10)
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}
	emailAdd := strings.TrimSpace(ctx.PostForm("email"))
	m_ctx := context.Background()
	requestUser, err := models.RegisterRequests(models.RegisterRequestWhere.Email.EQ(emailAdd)).One(m_ctx, a.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	user := models.User{
		Name:        requestUser.Name,
		Password:    string(hashed),
		Email:       emailAdd,
		Grade:       requestUser.Grade,
		IsTemporary: true,
	}
	if err := user.Insert(m_ctx, a.MyDB, boil.Infer()); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
		})
		return
	}
	msg := "" +
		"\r\n" +
		"仮登録が完了しました" +
		"\r\n" +
		"============================" +
		"\r\n" +
		"\r\n" +
		"氏名 : " + requestUser.Name + "\r\n" +
		"メールアドレス : " + emailAdd + "\r\n" +
		"入学年度 : " + strconv.Itoa(requestUser.Grade) + "\r\n" +
		"\r\n" +
		"こちらの仮パスワードからログインして, 新しくパスワードを設定してください" + "\r\n" +
		"\r\n" +
		"仮パスワード : " + randStr +
		"\r\n" +
		"\r\n" +
		"リンク : " + a.SiteUrl +
		"\r\n" +
		""
	a.MailInfo.SendMail("[仮登録完了のお知らせ]", msg, emailAdd, []string{})
	_, err = requestUser.Delete(m_ctx, a.MyDB)
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status":   "success",
		"password": randStr,
	})
}
