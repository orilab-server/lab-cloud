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
	"strconv"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"golang.org/x/crypto/bcrypt"
)

type Authcontroller struct {
	MyDB       *sql.DB
	SessionKey string
	MailInfo   mailservice.MailRequest
	SiteUrl    string
}

func (a Authcontroller) LoginController(ctx *gin.Context) {
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

func (a Authcontroller) LogoutController(ctx *gin.Context) {
	session := sessions.Default(ctx)
	user := session.Get(a.SessionKey)
	if user == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session token"})
		return
	}
	session.Delete(a.SessionKey)
	session.Save()
	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}

func (a Authcontroller) RequestRegister(ctx *gin.Context) {
	name := ctx.PostForm("name")
	email := strings.TrimSpace(ctx.PostForm("email"))
	grade, _ := strconv.Atoi(ctx.PostForm("grade"))
	m_ctx := context.Background()
	request := models.RegisterRequest{
		Name: name,
		Email: email,
		Grade: grade,
	}
	if err := request.Insert(m_ctx, a.MyDB, boil.Infer()); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (a Authcontroller) GetRegisterRequests(ctx *gin.Context) {
	requests, err := models.RegisterRequests().All(context.Background(), a.MyDB)
	fmt.Println(err)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"requests": requests,
	})
}

// admin registerd -> make user change the password
func (a Authcontroller) SignUpController(ctx *gin.Context) {
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
	email := strings.TrimSpace(ctx.PostForm("email"))
	m_ctx := context.Background()
	requestUser, err := models.RegisterRequests(models.RegisterRequestWhere.Email.EQ(email)).One(m_ctx, a.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	user := models.User{
		Name: requestUser.Name,
		Password: string(hashed),
		Email: email,
		Grade: requestUser.Grade,
		IsTemporary: true,
	}
	if err := user.Insert(m_ctx, a.MyDB, boil.Infer()); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
		})
		return
	}
	msg := []byte(""+
			"From: " + a.MailInfo.From + "\r\n" +
			"To: " + email + "\r\n" +
			"Subject: 件名 " + "[仮登録完了のお知らせ]" + "\r\n" +
			"\r\n" +
			"仮登録が完了しました" +
			"\r\n" +
			"============================" +
			"\r\n" +
			"\r\n" +
			"氏名 : " + requestUser.Name +  "\r\n" +
			"メールアドレス : " + email +  "\r\n" +
			"入学年度 : " + strconv.Itoa(requestUser.Grade) + "\r\n" +
			"\r\n" +
			"こちらの仮パスワードからログインして, 新しくパスワードを設定してください" + "\r\n" +
			"\r\n" +
			"仮パスワード : " + randStr +
			"\r\n" +
			"\r\n" +
			"リンク : " + a.SiteUrl +
			"\r\n" +
	"")
	a.MailInfo.SendOptional(msg, email)
	_, err = requestUser.Delete(m_ctx, a.MyDB)
	if err != nil {
		log.Fatal(err)
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status":   "success",
		"password": randStr,
	})
}
