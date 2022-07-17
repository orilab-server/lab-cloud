package controllers

import (
	"backend/service/mkrm_service"
	"backend/service/upload_service"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type PostController struct {
	ShareDir string
}

func (p PostController) Controller(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", p.ShareDir) // get Query Parameter
	newpath, _ := url.QueryUnescape(path)      // decode URL
	reqtype := ctx.Request.FormValue("type")
	switch reqtype {
	case "command":
		{
			json := mkrm_service.MkRmRequest{RequestType: ctx.Request.FormValue("requestType"), DirName: ctx.Request.FormValue("dirName"), FileName: ctx.Request.FormValue("fileName")}
			err := json.Run(newpath)
			if err != nil {
				fmt.Println(err)
				ctx.JSON(http.StatusOK, gin.H{
					"status": "fail",
				})
				return
			}
			ctx.JSON(http.StatusOK, gin.H{
				"status": "success",
			})
		}
	case "upload":
		{
			form, err := ctx.MultipartForm()
			if err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}
			files := form.File["files"]
			json := upload_service.UploadRequest{RequestType: ctx.Request.FormValue("requestType"), Files: files, FilePaths: ctx.Request.FormValue("filePaths")}
			uploadErr := json.Upload(newpath, ctx)
			if uploadErr != nil {
				fmt.Println(err)
				ctx.JSON(http.StatusOK, gin.H{
					"status": "fail",
				})
				return
			}
			ctx.JSON(http.StatusOK, gin.H{
				"status": "success",
			})
		}
	}
}