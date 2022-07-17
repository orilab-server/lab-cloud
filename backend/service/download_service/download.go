package download_service

import (
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

type DownloadResponse struct {
	ItemType string
	Target string
}

func (d DownloadResponse) Download(ctx *gin.Context, path string) {
	switch d.ItemType {
		case "file": {
			ctx.Header("Content-Description", "File Transfer")
			ctx.Header("Content-Transfer-Encoding", "binary")
			ctx.Header("Content-Disposition", "attachment; filename="+d.Target )
			ctx.Header("Content-Type", "application/octet-stream")
			if (strings.Contains(path, d.Target)) {
				ctx.File(path)
			} else {
				ctx.File(path+"/"+d.Target)
			}
			return
		}
		case "dir": {
			paths := dirwalk(path+"/"+d.Target)
			ctx.JSON(http.StatusOK, gin.H{
				"paths": paths,
			})
			return
		}
	}
}

// get files from under dir
func dirwalk(dir string) []string {
    files, err := ioutil.ReadDir(dir)
    if err != nil {
        panic(err)
    }

    var paths []string
    for _, file := range files {
        if file.IsDir() {
            paths = append(paths, dirwalk(filepath.Join(dir, file.Name()))...)
            continue
        }
        paths = append(paths, filepath.Join(dir, file.Name()))
    }

    return paths
}