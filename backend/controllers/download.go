package controllers

import (
	"backend/service/download_service"
	"net/url"

	"github.com/gin-gonic/gin"
)

type DownloadController struct {
	ShareDir string
}

func (d DownloadController) Controller(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", d.ShareDir) // get Query Parameter
	newpath, _ := url.QueryUnescape(path)        // decode URL
	target := ctx.Query("target")
	itemType := ctx.Query("type")
	download := download_service.DownloadResponse{ItemType: itemType, Target: target}
	download.Download(ctx, newpath)
}
