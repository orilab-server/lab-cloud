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

type GetController struct {
	ShareDir string
	Items []tools.StorageItem
}

func (g GetController) Controller(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", g.ShareDir) // get Query Parameter
		newpath, err := url.QueryUnescape(path)    // decode URL
		fmt.Print(newpath)
		// user cannot access private dir
		if !strings.Contains(newpath, g.ShareDir) {
			newpath = g.ShareDir
		}
		if err != nil {
			fmt.Println("error : ", err)
			return
		}
		items, err := tools.Getitems(newpath)
		fmt.Println(items)
		if err != nil {
			ctx.String(http.StatusBadRequest, "Bad Request")
			return
		}
		ishome := newpath == g.ShareDir
		jsonitems, _ := json.Marshal(items)
		ctx.JSON(http.StatusOK, gin.H{
			"items":  string(jsonitems),
			"ishome": ishome,
		})
}