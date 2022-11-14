package controllers

import (
	"backend/db"
	files_trash_table "backend/db/files_trash"
	command_service "backend/service/command"
	"backend/tools"
	"database/sql"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type RequestController struct {
	ImportantDirs []string
	ShareDir      string
	TrashDir      string
	MyDB          *sql.DB
}

func (r RequestController) MkDirController(ctx *gin.Context) {
	path := ctx.Query("path")  // get Qury Parameter
	// cannot access important dir or file
	important, _ := tools.Contains(r.ImportantDirs, path[strings.LastIndex(path, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	if err := command_service.Mkdir(path); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (r RequestController) MvController(ctx *gin.Context) {
	strByTrash := ctx.Query("byTrash")		  // get Query Parameter
	byTrash, _ := strconv.ParseBool(strByTrash)
	// ゴミ箱から元の場所に戻す時
	if byTrash {
		id := ctx.Query("id")
		res, _ := files_trash_table.SelectRow(r.MyDB, db.SelectQueryParam{From: "files_trash", Column: []string{"current_location", "past_location"}, Where: map[string]any{"id": id}})
		if err := files_trash_table.DeleteRow(r.MyDB, db.DeleteQueryParam{From: "files_trash", Where: map[string]any{"id": id}}); err != nil {
			fmt.Println(err)
		}
		if err := command_service.Mv(res.CurrentLocation, res.PastLocation); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{})
			return
		}
	} else {
		oldPath := ctx.Query("oldPath")         // get Query Parameter
		newPath := ctx.Query("newPath")  			  // get Query Parameter
		oldPath, _ = url.QueryUnescape(oldPath) // decode URL
		newPath, _ = url.QueryUnescape(newPath) // decode URL
		// cannot access important dir or file
		important, _ := tools.Contains(r.ImportantDirs, oldPath[strings.LastIndex(oldPath, "/")+1:])
		if important {
			ctx.JSON(http.StatusBadRequest, gin.H{})
			return
		}
		if err := command_service.Mv(oldPath, newPath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (r RequestController) MvTrashController(ctx *gin.Context) {
	path := ctx.Query("path")         // get Query Parameter
	itemType := ctx.Query("itemType") // get Query Parameter
	path, _ = url.QueryUnescape(path) // decode URL
	// cannot access important dir or file
	important, _ := tools.Contains(r.ImportantDirs, path[strings.LastIndex(path, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	command := command_service.MvTrashRequest{MyDB: r.MyDB, TrashDir: r.TrashDir}
	if err := command.MvTrash(path, itemType); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (r RequestController) RmFileController(ctx *gin.Context) {
	path := ctx.Query("path")         // get Query Parameter
	id := ctx.Query("id")             // get Query Parameter
	path, _ = url.QueryUnescape(path) // decode URL
	// cannot access important dir or file
	important, _ := tools.Contains(r.ImportantDirs, path[strings.LastIndex(path, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	command := command_service.RmFileRequest{MyDB: r.MyDB, TrashDir: r.TrashDir}
	if err := command.RmFile(path, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (r RequestController) RmDirController(ctx *gin.Context) {
	path := ctx.Query("path")         // get Query Parameter
	id := ctx.Query("id")             // get Query Parameter
	path, _ = url.QueryUnescape(path) // decode URL
	// cannot access important dir or file
	important, _ := tools.Contains(r.ImportantDirs, path[strings.LastIndex(path, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	command := command_service.RmDirRequest{MyDB: r.MyDB, TrashDir: r.TrashDir}
	if err := command.RmDir(path, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}
