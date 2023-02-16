package home

import (
	command_service "backend/service/command"
	"backend/tools"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func (r HomeController) MkDir(ctx *gin.Context) {
	path := ctx.Query("path") // get Qury Parameter
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

func (r HomeController) Rename(ctx *gin.Context) {
	oldName := ctx.Query("oldName") // get Query Parameter
	newName := ctx.Query("newName") // get Query Parameter
	// cannot access important dir or file
	important, _ := tools.Contains(r.ImportantDirs, oldName[strings.LastIndex(oldName, "/")+1:])
	if important {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	if err := command_service.Mv(oldName, newName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
}