package controllers

import (
	mailservice "backend/service/mail_service"
	"backend/service/mkrm_service"
	"backend/tools"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

type RequestController struct {
	ImportantDirs []string
	ShareDir string
	MailInfo mailservice.MailRequest
}

func (p RequestController) Controller(ctx *gin.Context) {
	requestType := ctx.Request.FormValue("requestType")
	if requestType == "mail" {
		who := strings.TrimSpace(ctx.PostForm("who"))
		subject := strings.TrimSpace(ctx.PostForm("subject"))
		body := strings.TrimSpace(ctx.PostForm("body"))
		msg := []byte(""+
				"From: " + p.MailInfo.From + "\r\n" +
        "To: " + p.MailInfo.To + "\r\n" +
        "Subject: 件名 " + " ["+who+"] " + subject + 
				"\r\n" +
				"\r\n" +
        "============================" +
        "\r\n" +
        "\r\n" +
        body + "\r\n" +
    "")
		err := p.MailInfo.Send(msg)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{})
		return
	}
	path := ctx.DefaultQuery("path", p.ShareDir) // get Query Parameter
	newpath, _ := url.QueryUnescape(path)        // decode URL
	important := tools.Contains(p.ImportantDirs, newpath[strings.LastIndex(newpath, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	json := mkrm_service.MkRmRequest{RequestType: requestType, DirName: ctx.Request.FormValue("dirName"), FileName: ctx.Request.FormValue("fileName")}
	err := json.Run(newpath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}
