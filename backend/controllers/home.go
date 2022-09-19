package controllers

import (
	"backend/tools"
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
}

func (g HomeController) Controller(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", g.ShareDir) // get Query Parameter
	newpath, err := url.QueryUnescape(path)      // decode URL
	// user cannot access private dir
	if !strings.Contains(newpath, g.ShareDir) {
		newpath = g.ShareDir
	}
	if err != nil {
		fmt.Println("error : ", err)
		return
	}
	filepaths, err := tools.GetDirAndFilePaths(newpath)
	// treat trash path as a separate entity
	trashpath := tools.StorageItem{Path: g.TrashDir, Type: "dir"}
	if tools.Contains(filepaths, trashpath) {
		filepaths = tools.Filter(filepaths, trashpath)
	}
	if err != nil {
		ctx.String(http.StatusBadRequest, "Bad Request")
		return
	}
	topDirs, _ := tools.GetDirs(g.ShareDir)
	ishome := newpath == g.ShareDir
	jsonitems, _ := json.Marshal(filepaths)
	important := tools.Contains(g.ImportantDirs, newpath[strings.LastIndex(newpath, "/")+1:])
	ctx.JSON(http.StatusOK, gin.H{
		"topdirs":   tools.Filter(topDirs, g.TrashDir),
		"basedir":   g.ShareDir,
		"trashdir":  g.TrashDir,
		"filepaths": string(jsonitems),
		"ishome":    ishome,
		"important": important,
	})
}

