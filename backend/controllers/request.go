package controllers

import (
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
}

func (p RequestController) Controller(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", p.ShareDir) // get Query Parameter
	newpath, _ := url.QueryUnescape(path)        // decode URL
	important := tools.Contains(p.ImportantDirs, newpath[strings.LastIndex(newpath, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	json := mkrm_service.MkRmRequest{RequestType: ctx.Request.FormValue("requestType"), DirName: ctx.Request.FormValue("dirName"), FileName: ctx.Request.FormValue("fileName")}
	err := json.Run(newpath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}
