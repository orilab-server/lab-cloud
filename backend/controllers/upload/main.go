package upload

import (
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type UploadController struct {
	ShareDir string
}

func (u UploadController) UploadFile(ctx *gin.Context) {
	path := u.ShareDir+"/"+ctx.Query("path")
	path, _ = url.QueryUnescape(path) 
	file, _ := ctx.FormFile("file")
	formatNow := time.Now().Format("2006-01-02 15:04")
	ctx.SaveUploadedFile(file, path+"/"+file.Filename[:strings.Index(file.Filename,".")]+"_"+formatNow+file.Filename[strings.Index(file.Filename,"."):])
}

func (u UploadController) UploadFolder(ctx *gin.Context) {
	// queryのpathのフォーマットは /${top}/${next}
	path := u.ShareDir+ctx.Query("path")
	path, _ = url.QueryUnescape(path) 
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	files := form.File["files"]
		if err := os.MkdirAll(path, 0777); err != nil {
			return
		}
	for _, file := range files {
		fileName := file.Filename
		formatNow := time.Now().Format("2006-01-02 15:04")
		if string(fileName[0]) == "." {
			// 隠しファイルには日時を登録しない
			ctx.SaveUploadedFile(file, path+"/"+fileName)
		} else if strings.Contains(fileName, ".") {
			// 通常ファイルには拡張子の直前に時刻を挿入
			ctx.SaveUploadedFile(file, path+"/"+fileName[:strings.Index(fileName,".")]+"_"+formatNow+fileName[strings.Index(fileName,"."):])
		} else {
			// 拡張子がないファイルはファイル名の後ろに時刻をつける
			ctx.SaveUploadedFile(file, path+"/"+fileName+"_"+formatNow)
		}
	}
} 
