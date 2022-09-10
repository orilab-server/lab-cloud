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
	path := ctx.DefaultQuery("path", p.ShareDir) // get Query Parameter
	newpath, _ := url.QueryUnescape(path)        // decode URL
	important := tools.Contains(p.ImportantDirs, newpath[strings.LastIndex(newpath, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	requestType := ctx.Request.FormValue("requestType")
	dirName := ctx.Request.FormValue("dirName")
	fileName := ctx.Request.FormValue("fileName")
	json := mkrm_service.MkRmRequest{RequestType: requestType, DirName: dirName, FileName: fileName}
	err := json.Run(newpath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}
