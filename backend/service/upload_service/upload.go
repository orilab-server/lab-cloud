package upload_service

import (
	"backend/tools"
	"fmt"
	"mime/multipart"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type UploadRequest struct {
	RequestType string                  `json:"requestType"`
	Files       []*multipart.FileHeader `json:"files"`
	FilePaths   string                  `json:"filePaths"`
}

func (p UploadRequest) Upload(dir string, ctx *gin.Context) error {
	switch p.RequestType {
	case "files":
		{
			p.uploadfiles(dir, ctx)
			return nil
		}
	case "dirs":
		{
			p.uploaddir(dir, ctx)
			return nil
		}
	}
	return fmt.Errorf("error: %s", "cannot upload")
}

func (p UploadRequest) uploadfiles(dir string, ctx *gin.Context) {
	for _, file := range p.Files {
		ctx.SaveUploadedFile(file, dir+"/"+file.Filename)
	}
}

func (p UploadRequest) uploaddir(dir string, ctx *gin.Context) {
	fileNameList := strings.Split(p.FilePaths, " // ")
	mkPaths := getMkPaths(fileNameList)
	for _, path := range mkPaths {
		if err := os.MkdirAll(dir+"/"+path, 0777); err != nil {
			fmt.Println(err)
		}
	}
	for index, file := range p.Files {
		ctx.SaveUploadedFile(file, dir+"/"+fileNameList[index])
	}
}

func getMkPaths(list []string) []string {
	var paths []string
	for _, item := range list {
		path := item[0:strings.LastIndex(item, "/")]
		if exist, _ := tools.Contains(paths, path); exist {
			paths = append(paths, path)
		}
	}
	return paths
}
