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
	ShareDir string
	Items    []tools.StorageItem
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
	filepaths, err := tools.Getitems(newpath)
	if err != nil {
		ctx.String(http.StatusBadRequest, "Bad Request")
		return
	}
	topDirs, _ := tools.GetDirs(g.ShareDir)
	ishome := newpath == g.ShareDir
	jsonitems, _ := json.Marshal(filepaths)
	ctx.JSON(http.StatusOK, gin.H{
		"topdirs": topDirs,
		"basedir": g.ShareDir,
		"filepaths":   string(jsonitems),
		"ishome":  ishome,
	})
}
