package download_service

import (
	"archive/zip"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type DownloadResponse struct {
	ItemType string
	Target string
}

func (d DownloadResponse) Download(ctx *gin.Context, path string) {
	switch d.ItemType {
		case "file": {
			filePath := path+"/"+d.Target
			ctx.Header("Content-Description", "File Transfer")
			ctx.Header("Content-Transfer-Encoding", "binary")
			ctx.Header("Content-Disposition", "attachment; filename="+d.Target )
			ctx.Header("Content-Type", "application/octet-stream")
			ctx.File(filePath)
			return
		}
		case "dir": {
			zipPath := path+"/"+d.Target+".zip"
			dirPath := path+"/"+d.Target
			out, err := os.Create(zipPath)
			if err != nil {
				fmt.Println(err)
				return
			}
			
			w := zip.NewWriter(out)
			
			if err := addFilesToZip(w, dirPath, ""); err != nil {
				_ = out.Close()
				fmt.Println(err)
				return
			}

			if err := w.Close(); err != nil {
				fmt.Println(err)
				return
			}
			
			if err := out.Close(); err != nil {
				fmt.Println(err)
				return
			}

			ctx.Header("Content-Description", "File Transfer")
			ctx.Header("Content-Transfer-Encoding", "binary")
			ctx.Header("Content-Disposition", "attachment; filename="+d.Target+".zip" )
			ctx.Header("Content-Type", "application/octet-stream")
			ctx.File(zipPath)

			os.Remove(zipPath)

			return
		}
	}
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
		if file.Mode() & os.ModeSymlink != 0 {
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