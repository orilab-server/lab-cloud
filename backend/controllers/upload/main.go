package upload

import (
	"backend/models"
	"context"
	"database/sql"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type UploadController struct {
	ShareDir string
	MyDB     *sql.DB
	ModelCtx context.Context
}

func (u UploadController) UploadFile(ctx *gin.Context) {
	path := ctx.Query("path")
	path, _ = url.QueryUnescape(path)
	file, _ := ctx.FormFile("file")
	userId, _ := strconv.Atoi(ctx.PostForm("userId"))
	formatNow := time.Now().Format("2006-01-02 15:04")
	// アップロードファイルをrecent_filesに登録 & 50件超過の場合は古いものから削除する
	recentFileCount, _ := models.RecentFiles(qm.OrderBy("created_at desc")).Count(u.ModelCtx, u.MyDB)
	if recentFileCount >= 50 {
		delCount := recentFileCount - 49
		delFiles, _ := models.RecentFiles(qm.Limit(int(delCount)), qm.OrderBy("created_at desc")).All(u.ModelCtx, u.MyDB)
		for _, f := range delFiles {
			delFile, _ := models.FindRecentFile(u.ModelCtx, u.MyDB, f.ID)
			delFile.Delete(u.ModelCtx, u.MyDB)
		}
	}
	id, _ := uuid.NewUUID()
	recents := models.RecentFile{ID: id.String(), UserID: userId, Location: path, FileName: file.Filename, Type: "file"}
	recents.Insert(u.ModelCtx, u.MyDB, boil.Infer())
	path = u.ShareDir + ctx.Query("path")
	ctx.SaveUploadedFile(file, path+"/"+file.Filename[:strings.Index(file.Filename, ".")]+"_"+formatNow+file.Filename[strings.Index(file.Filename, "."):])
}

func (u UploadController) UploadFolder(ctx *gin.Context) {
	// queryのpathのフォーマットは /${top}/${next}
	dirPath := ctx.Query("path")
	path := u.ShareDir + dirPath
	path, _ = url.QueryUnescape(path)
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	files := form.File["files"]
	if err := os.MkdirAll(path, 0777); err != nil {
		return
	}
	for _, file := range files {
		fileName := file.Filename
		formatNow := time.Now().Format("2006-01-02 15:04")
		if string(fileName[0]) == "." {
			// 隠しファイルには日時を登録しない
			ctx.SaveUploadedFile(file, path+"/"+fileName)
		} else if strings.Contains(fileName, ".") {
			// 通常ファイルには拡張子の直前に時刻を挿入
			ctx.SaveUploadedFile(file, path+"/"+fileName[:strings.Index(fileName, ".")]+"_"+formatNow+fileName[strings.Index(fileName, "."):])
		} else {
			// 拡張子がないファイルはファイル名の後ろに時刻をつける
			ctx.SaveUploadedFile(file, path+"/"+fileName+"_"+formatNow)
		}
	}
}
