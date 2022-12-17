package controllers

import (
	mailservice "backend/service/mail_service"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type SendController struct {
	MailInfo mailservice.MailRequest
}

func (s SendController) MailController(ctx *gin.Context) {
	who := strings.TrimSpace(ctx.PostForm("who"))
	subject := strings.TrimSpace(ctx.PostForm("subject"))
	mime := strings.TrimSpace(ctx.PostForm("mime"))
	body := strings.TrimSpace(ctx.PostForm("body"))
	msg := []byte(""+
			"From: " + s.MailInfo.From + "\r\n" +
			"To: " + s.MailInfo.To + "\r\n" +
			"Subject: 件名 " + " ["+who+"] " + subject + "\r\n" +
			mime +
			"\r\n" +
			"\r\n" +
			"============================" +
			"\r\n" +
			"\r\n" +
			body + "\r\n" +
	"")
	err := s.MailInfo.Send(msg)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{})
}