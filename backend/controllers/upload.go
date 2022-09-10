package controllers

import (
	"backend/service/upload_service"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type UploadController struct {
	ShareDir string
}

func (p UploadController) Controller(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", p.ShareDir) // get Query Parameter
	newpath, _ := url.QueryUnescape(path)        // decode URL
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	files := form.File["files"]
	json := upload_service.UploadRequest{RequestType: ctx.Request.FormValue("requestType"), Files: files, FilePaths: ctx.Request.FormValue("filePaths")}
	uploadErr := json.Upload(newpath, ctx)
	if uploadErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}
