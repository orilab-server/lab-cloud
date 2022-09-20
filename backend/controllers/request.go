package controllers

import (
	command_service "backend/service/command"
	"backend/tools"
	"database/sql"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

type RequestController struct {
	ImportantDirs []string
	ShareDir      string
	TrashDir      string
	MyDB          *sql.DB
}

func (p RequestController) MvController(ctx *gin.Context) {
	oldPath := ctx.Query("oldPath")                // get Query Parameter
	newPath := ctx.Query("newPath") 							 // get Query Parameter
	oldPath, _ = url.QueryUnescape(oldPath)        // decode URL
	newPath, _ = url.QueryUnescape(newPath)        // decode URL
	// cannot access important dir or file
	important := tools.Contains(p.ImportantDirs, oldPath[strings.LastIndex(oldPath, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	if err := command_service.Mv(oldPath, newPath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (p RequestController) MvTrashController(ctx *gin.Context) {
	path := ctx.Query("path")          // get Query Parameter
	itemType := ctx.Query("itemType") // get Query Parameter
	path, _ = url.QueryUnescape(path) // decode URL
	// cannot access important dir or file
	important := tools.Contains(p.ImportantDirs, path[strings.LastIndex(path, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	command := command_service.MvTrashRequest{MyDB: p.MyDB, TrashDir: p.TrashDir}
	if err := command.MvTrash(path, itemType); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (p RequestController) RmFileController(ctx *gin.Context) {
	path := ctx.Query("path")         // get Query Parameter
	id := ctx.Query("id")             // get Query Parameter
	path, _ = url.QueryUnescape(path) // decode URL
	// cannot access important dir or file
	important := tools.Contains(p.ImportantDirs, path[strings.LastIndex(path, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	command := command_service.RmFileRequest{MyDB: p.MyDB, TrashDir: p.TrashDir}
	if err := command.RmFile(path, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (p RequestController) RmDirController(ctx *gin.Context) {
	path := ctx.Query("path")         // get Query Parameter
	id := ctx.Query("id")             // get Query Parameter
	path, _ = url.QueryUnescape(path) // decode URL
	// cannot access important dir or file
	important := tools.Contains(p.ImportantDirs, path[strings.LastIndex(path, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	command := command_service.RmDirRequest{MyDB: p.MyDB, TrashDir: p.TrashDir}
	if err := command.RmDir(path, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}
