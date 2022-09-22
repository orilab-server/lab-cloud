package controllers

import (
	"backend/db"
	files_trash_table "backend/db/files_trash"
	"backend/tools"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
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

func (g HomeController) Controller(ctx *gin.Context) {
	path := ctx.DefaultQuery("path", g.ShareDir) // get Query Parameter
	newpath, err := url.QueryUnescape(path)      // decode URL
	// 共有ディレクトリ以外にはアクセスできない
	if !strings.Contains(newpath, g.ShareDir) {
		newpath = g.ShareDir
	}
	if err != nil {
		fmt.Println("error : ", err)
		return
	}
	reg := regexp.MustCompile(g.TrashDir)
	istrash := reg.MatchString(newpath)
	filepaths, err := tools.GetDirAndFilePaths(newpath)
	if istrash {
		res, err := files_trash_table.SelectRows(g.MyDB, db.SelectQueryParam{From: "files_trash", Column: []string{"*"}, Where: map[string]any{}})
		if err != nil {
			fmt.Println("err : ", err)
		} else {
			for _, r := range res {
				if exist, index := tools.Contains(filepaths, tools.StorageItem{Id: "",Path: r.CurrentLocation, Type: r.Type}); exist {
					filepaths[index] = tools.StorageItem{Id: r.Id, Path: filepaths[index].Path, Type: filepaths[index].Type}
				}
			}
		}
	}
	// ゴミ箱ディレクトリへのパスは別で返す
	trashpath := tools.StorageItem{Path: g.TrashDir, Type: "dir"}
	if exist, _ := tools.Contains(filepaths, trashpath); exist {
		filepaths = tools.Filter(filepaths, trashpath)
	}
	if err != nil {
		ctx.String(http.StatusBadRequest, "Bad Request")
		return
	}
	topDirs, _ := tools.GetDirs(g.ShareDir)
	ishome := newpath == g.ShareDir
	jsonitems, _ := json.Marshal(filepaths)
	important, _ := tools.Contains(g.ImportantDirs, newpath[strings.LastIndex(newpath, "/")+1:])
	ctx.JSON(http.StatusOK, gin.H{
		"topdirs":   tools.Filter(topDirs, g.TrashDir),
		"basedir":   g.ShareDir,
		"trashdir":  g.TrashDir,
		"filepaths": string(jsonitems),
		"ishome":    ishome,
		"istrash":   istrash,
		"important": important,
	})
}

