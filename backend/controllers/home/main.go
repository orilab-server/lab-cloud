package home

import (
	"backend/tools"
	"database/sql"
	"encoding/json"
	"fmt"
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

// 
func (g HomeController) Main(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", g.ShareDir) // get Query Parameter
	newPath, err := url.QueryUnescape(path)      // decode URL
	// 共有ディレクトリ以外にはアクセスできない
	if !strings.Contains(newPath, g.ShareDir) {
		newPath = g.ShareDir
	}
	if err != nil {
		fmt.Println("error : ", err)
		return
	}
	filePaths, err := tools.GetDirAndFilePaths(newPath)
	if err != nil {
		ctx.String(http.StatusBadRequest, "Bad Request")
		return
	}
	topDirs, _ := tools.GetDirs(g.ShareDir)
	isTop := newPath == g.ShareDir
	jsonItems, _ := json.Marshal(filePaths)
	important, _ := tools.Contains(g.ImportantDirs, newPath[strings.LastIndex(newPath, "/")+1:])
	ctx.JSON(http.StatusOK, gin.H{
		"filePaths": string(jsonItems),
		"topDirs":   tools.Filter(topDirs, g.TrashDir),
		"baseDir":   g.ShareDir,
		"isTop":     isTop,
		"important": important,
	})
}

