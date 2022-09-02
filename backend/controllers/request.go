package controllers

import (
	"backend/service/mkrm_service"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type RequestController struct {
	ShareDir string
}

func (p RequestController) Controller(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", p.ShareDir) // get Query Parameter
	newpath, _ := url.QueryUnescape(path)        // decode URL
	json := mkrm_service.MkRmRequest{RequestType: ctx.Request.FormValue("requestType"), DirName: ctx.Request.FormValue("dirName"), FileName: ctx.Request.FormValue("fileName")}
	err := json.Run(newpath)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"status": "fail",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
	})
}
