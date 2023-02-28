package download

import (
	"archive/zip"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type DownloadController struct {
	ShareDir string
}

func (d DownloadController) DownloadFile(ctx *gin.Context) {
	path := d.ShareDir+ctx.Query("path")
	path, _ = url.QueryUnescape(path) 
	name := ctx.Query("name")
	filePath := path+"/"+name
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Disposition", "attachment; filename="+name)
	ctx.Header("Content-Type", "application/octet-stream")
	ctx.File(filePath)
}

func (d DownloadController) DownloadFolder(ctx *gin.Context) {
	path := d.ShareDir+ctx.Query("path")
	path, _ = url.QueryUnescape(path) 
	name := ctx.Query("name")
	dirPath := path+"/"+name
	zipPath := dirPath+".zip"
	out, err := os.Create(zipPath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	w := zip.NewWriter(out)
	if err := addFilesToZip(w, dirPath, ""); err != nil {
		out.Close()
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	if err := w.Close(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}

	if err := out.Close(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Disposition", "attachment; filename="+name+".zip")
	ctx.Header("Content-Type", "application/octet-stream")
	ctx.File(zipPath)

	os.Remove(zipPath)
}

func addFilesToZip(w *zip.Writer, basePath, baseInZip string) error {
	files, err := ioutil.ReadDir(basePath)
	if err != nil {
		return err
	}

	for _, file := range files {
		fullPath := filepath.Join(basePath, file.Name())
		if _, err := os.Stat(fullPath); os.IsNotExist(err) {
			continue
		}
		if file.Mode()&os.ModeSymlink != 0 {
			continue
		}

		if file.IsDir() {
			if err := addFilesToZip(w, fullPath, filepath.Join(baseInZip, file.Name())); err != nil {
				return err
			}
		} else if file.Mode().IsRegular() {
			dat, err := ioutil.ReadFile(fullPath)
			if err != nil {
				return err
			}
			f, err := w.Create(filepath.Join(baseInZip, file.Name()))
			if err != nil {
				return err
			}
			_, err = f.Write(dat)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
