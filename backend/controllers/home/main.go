package home

import (
	"backend/tools"
	"database/sql"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

type HomeController struct {
	ImportantDirs []string
	ShareDir      string
	TrashDir      string
	Items         tools.StorageItem
	MyDB          *sql.DB
}

func (g HomeController) Main(ctx *gin.Context) {
	path, err := url.QueryUnescape(ctx.DefaultQuery("path", g.ShareDir))
	// TODO : 共有ディレクトリ以外へのアクセスをできないような実装
	if err != nil {
		path = g.ShareDir
	} else {
		path = g.ShareDir + "/" + path
	}
	fileNames, err := tools.GetDirAndFileNames(path)
	if err != nil {
		fileNames = []tools.StorageItem{}
	}
	important, _ := tools.Contains(g.ImportantDirs, path[strings.LastIndex(path, "/")+1:])
	ctx.JSON(http.StatusOK, gin.H{
		"fileNames": fileNames,
		"important": important,
	})
}
