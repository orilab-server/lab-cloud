package main

import (
	"backend/service/mkrm_service"
	"backend/service/upload_service"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type StorageItem struct {
	Path string `json:"path"`
	Type string `json:"type"`
}

func main() {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	// 暫定
	sharedir := home + "/Desktop/Laboratory"
	items, _ := getitems(sharedir)
	engine := gin.Default()
	// htmlのディレクトリを指定
	// engine.LoadHTMLGlob("templates/*")
	engine.Use(cors.New(cors.Config{
		// アクセスを許可したいアクセス元
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		// アクセスを許可したいHTTPメソッド(以下の例だとPUTやDELETEはアクセスできません)
		AllowMethods: []string{
			"POST",
			"GET",
			"OPTIONS",
		},
		// 許可したいHTTPリクエストヘッダ
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
		},
		// cookieなどの情報を必要とするかどうか
		AllowCredentials: true,
		// preflightリクエストの結果をキャッシュする時間
		MaxAge: 24 * time.Hour,
	}))
	engine.GET("/", func(ctx *gin.Context) {
		path := ctx.DefaultQuery("path", sharedir) // get Query Parameter
		newpath, err := url.QueryUnescape(path)    // decode URL
		// user cannot access private dir
		if !strings.Contains(newpath, sharedir) {
			newpath = sharedir
		}
		if err != nil {
			fmt.Println("error : ", err)
			return
		}
		items, err = getitems(newpath)
		if err != nil {
			ctx.Redirect(http.StatusFound, "/")
			ctx.String(http.StatusBadRequest, "Bad Request")
			return
		}
		ishome := newpath == sharedir
		jsonitems, _ := json.Marshal(items)
		ctx.JSON(http.StatusOK, gin.H{
			"items":  string(jsonitems),
			"ishome": ishome,
		})
	})
	engine.POST("/", func(ctx *gin.Context) {
		path := ctx.DefaultQuery("path", sharedir) // get Query Parameter
		newpath, _ := url.QueryUnescape(path)      // decode URL
		reqtype := ctx.Request.FormValue("type")
		switch reqtype {
		case "command":
			{
				json := mkrm_service.MkRmRequest{RequestType: ctx.Request.FormValue("requestType"), DirName: ctx.Request.FormValue("dirName"), FileName: ctx.Request.FormValue("fileName")}
				err := json.Run(newpath)
				if err != nil {
					fmt.Println(err)
					ctx.JSON(http.StatusOK, gin.H{
						"status": "fail",
					})
					return
				}
				ctx.JSON(http.StatusOK, gin.H{
					"status": "success",
				})
			}
		case "upload":
			{
				form, err := ctx.MultipartForm()
				if err != nil {
					ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				}
				files := form.File["files"]
				json := upload_service.UploadRequest{RequestType: ctx.Request.FormValue("requestType"), Files: files, DirName: ctx.Request.FormValue("dirName")}
				fmt.Println(json)
				uploaderr := json.Upload(newpath, ctx)
				if uploaderr != nil {
					fmt.Println(err)
					ctx.JSON(http.StatusOK, gin.H{
						"status": "fail",
					})
					return
				}
				ctx.JSON(http.StatusOK, gin.H{
					"status": "success",
				})
			}
		}
	})
	engine.Run(":8000")
}

// return dir and file of paths and types
func getitems(dir string) ([]StorageItem, error) {
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var items []StorageItem
	for _, file := range files {
		if file.IsDir() {
			items = append(items, StorageItem{Path: filepath.Join(dir, file.Name()), Type: "dir"})
			continue
		}
		items = append(items, StorageItem{Path: filepath.Join(dir, file.Name()), Type: "file"})
	}

	return items, nil
}
