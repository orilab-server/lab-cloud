package upload_service

import (
	"fmt"
	"mime/multipart"

	"github.com/gin-gonic/gin"
)

type UploadRequest struct {
	RequestType string `json:"requestType"`
	Files []*multipart.FileHeader `json:"files"`
	DirName string `json:"dirName"`
}

func (p UploadRequest) Upload(dir string, ctx *gin.Context) error {
	switch p.RequestType {
	case "files": {
		p.uploadfiles(dir, ctx)
		return nil
	}
	case "dirs": {
		p.uploaddirs(dir, ctx)
		return nil
	}
	}
	return fmt.Errorf("error: %s", "cannot upload")
}

func (p UploadRequest) uploadfiles(dir string, ctx *gin.Context) {
	for _, file := range p.Files {
		fmt.Println(file.Filename)
		ctx.SaveUploadedFile(file, dir+"/"+file.Filename)
	}
}

func (p UploadRequest) uploaddirs(dir string, ctx *gin.Context) {

}
