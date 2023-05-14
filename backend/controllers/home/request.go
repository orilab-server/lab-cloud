package home

import (
	"backend/tools"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func (r HomeController) MkDir(ctx *gin.Context) {
	path := ctx.Query("path") // get Qury Parameter
	path = r.ShareDir+"/"+path
	// cannot access important dir or file
	if err := os.Mkdir(path, 0777); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (r HomeController) Rename(ctx *gin.Context) {
	path := ctx.Query("path")
	oldName := ctx.Query("oldName") // get Query Parameter
	newName := ctx.Query("newName") // get Query Parameter
	oldName = r.ShareDir+path+"/"+oldName
	newName = r.ShareDir+path+"/"+newName
	// cannot access important dir or file
	important, _ := tools.Contains(r.ImportantDirs, oldName[strings.LastIndex(oldName, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	if err := os.Rename(oldName, newName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (r HomeController) Move(ctx *gin.Context) {
	path := ctx.Query("path")
	if path == "/" {
		path = r.ShareDir
	} else {
		path = r.ShareDir+path
	}
	targetPaths := ctx.Query("targetPaths")
	targetPathList := strings.Split(targetPaths, "/")
	targetPathList = tools.Filter(targetPathList, "")
	toFolder := ctx.Query("toFolder")
	for _, t := range targetPathList {
		if err := os.Rename(path+"/"+t, path+"/"+toFolder+"/"+t); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{})
			return
		}
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (r HomeController) MoveHigher(ctx *gin.Context) {
	path := ctx.Query("path")
	if path == "/" {
		path = r.ShareDir
	} else {
		path = r.ShareDir+path
	}
	targetPaths := ctx.Query("targetPaths")
	targetPathList := strings.Split(targetPaths, "/")
	targetPathList = tools.Filter(targetPathList, "")
	fromFolder := ctx.Query("fromFolder")
	for _, t := range targetPathList {
		if err := os.Rename(r.ShareDir+"/"+fromFolder+"/"+t, path+"/"+t); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{})
			return
		}
	}
	ctx.JSON(http.StatusOK, gin.H{})
}