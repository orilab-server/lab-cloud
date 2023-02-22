package home

import (
	"backend/models"
	"backend/tools"
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/volatiletech/null/v8"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

type TrashFile struct {
	PastLocationPath  string `json:"pastLocationPath"`
	Type              string `json:"type"`
	CreatedAt         string `json:"createdAt"`
	UserID            int `json:"userId"`
}

/*
 * ゴミ箱内の情報を取得
*/
func (h HomeController) GetTrash(ctx *gin.Context) {
	modelCtx := context.Background()
	filesTrashes, err := models.FilesTrashes().All(modelCtx, h.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"trashItems": filesTrashes,
	})
}

// ゴミ箱内の指定のフォルダ内のコンテンツを返す関数
func (h HomeController) GetFilesInDir(ctx *gin.Context) {
	targetDir := ctx.Param("dir")
	contents, err := tools.GetDirAndFileNames(targetDir)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"contents": contents,
	})
}

/*
 * restore → 元の場所に戻す
*/
// ファイル・フォルダを元の場所に戻す関数
func (h HomeController) RestoreItems(ctx *gin.Context) {
	ids := strings.Split(ctx.PostForm("ids"), ",")
	errFiles := []string{}
	m_ctx := context.Background()
	for _, id := range ids {
		target, err :=  models.FindFilesTrash(m_ctx, h.MyDB, id)
		if err != nil {
			continue
		}
		name := target.Name
		// 元の場所に戻す操作
		fmt.Println(target.PastLocation)
		if err := os.Rename(h.TrashDir+"/"+name, target.PastLocation); err != nil {
			errFiles = append(errFiles, name)
			continue
		}
		// dbに登録されている情報を削除
		if _, err := target.Delete(m_ctx, h.MyDB); err != nil {
			// エラーがあった場合はロールバック
			os.Rename(target.PastLocation, h.TrashDir + "/" + name)
			errFiles = append(errFiles, name)
			
		}
	}
	message := ""
	if len(errFiles) > 0 {
		message = "以下のフォルダが移動できませんでした\n" + strings.Join(errFiles, " , ")
	}
	ctx.JSON(http.StatusOK, gin.H{"message": message})
}

/*
 * dump → ゴミ箱に移動
*/
// ファイル(複数可)をゴミ箱ディレクトリに移動する操作
func (h HomeController) DumpFiles(ctx *gin.Context) {
	filePaths := strings.Split(ctx.PostForm("filePaths"), "///")
	fmt.Println(filePaths)
	userId, _ := strconv.Atoi(ctx.PostForm("userId"))
	errFiles := []string{}
	for _, filePath := range filePaths {
		fileName := filePath[strings.LastIndex(filePath, "/")+1:]
		size, _ := tools.GetFileSize(filePath)
		filePath = h.ShareDir+filePath
		newPath := h.TrashDir+"/"+fileName
		if err := os.Rename(filePath, newPath); err != nil {
			errFiles = append(errFiles, filePath)
			// 移動できなかったものについてはdbへの登録も行わない
			continue
		}
		id, _ := uuid.NewUUID()
		item := models.FilesTrash{
			ID: id.String(),
			Name: fileName,
			Size: null.Int64{Int64: size, Valid: true},
			PastLocation: filePath,
			UserID: userId,
			Type: "file",
		}
		if err := item.Insert(context.Background(), h.MyDB, boil.Infer()); err != nil {
			// ファイル移動には成功したが, dbへの登録が失敗した場合は移動ずみのものを削除
			os.Remove(newPath)
			
			errFiles = append(errFiles, fileName)
		}
	}
	message := ""
	if len(errFiles) > 0 {
		message = "以下のファイルが移動できませんでした\n" + strings.Join(errFiles, " , ")
	}
	ctx.JSON(http.StatusOK, gin.H{"message": message})
}

// フォルダ(複数可)をゴミ箱ディレクトリに移動する操作
func (h HomeController) DumpDirs(ctx *gin.Context) {
	dirPaths := strings.Split(ctx.PostForm("dirPaths"), "///")
	userId, _ := strconv.Atoi(ctx.PostForm("userId"))
	errFolders := []string{}
	for _, dirPath := range dirPaths {
		folderName := dirPath[strings.LastIndex(dirPath, "/")+1:]
		size, _ := tools.GetFileSize(dirPath)
		dirPath = h.ShareDir+dirPath
		newPath := h.TrashDir+"/"+folderName
		if err := os.Rename(dirPath, newPath); err != nil {
			// 移動できなかったものについてはdbへの登録も行わない
			continue
		}
		id, _ := uuid.NewUUID()
		item := models.FilesTrash{
			ID: id.String(),
			Name: folderName,
			Size: null.Int64{Int64: size, Valid: true},
			PastLocation: dirPath,
			UserID: userId,
			Type: "dir",
		}
		if err := item.Insert(context.Background(), h.MyDB, boil.Infer()); err != nil {
			// フォルダ移動には成功したが, dbへの登録が失敗した場合は移動ずみのものを削除
			os.RemoveAll(newPath)
			
			errFolders = append(errFolders, folderName)
		}
	}
	message := ""
	if len(errFolders) > 0 {
		message = "以下のフォルダが移動できませんでした\n" + strings.Join(errFolders, " , ")
	}
	ctx.JSON(http.StatusOK, gin.H{"message": message})
}

/*
 * remove → ゴミ箱から削除
*/
func (h HomeController) RemoveAll(ctx *gin.Context) {
	ids := strings.Split(ctx.PostForm("ids"), ",")
	m_ctx := context.Background()
	errFiles := []string{}
	for _, id := range ids {
		item, _ := models.FindFilesTrash(m_ctx, h.MyDB, id)
		name := item.Name
		var err error = nil
		if item.Type == "file" {
			err = os.Remove(h.TrashDir+"/"+name)
		} else {
			err = os.RemoveAll(h.TrashDir+"/"+name)
		}
		if err != nil {
			errFiles = append(errFiles, name)
			continue
		}
		item.Delete(m_ctx, h.MyDB)
	}
	message := ""
	if len(errFiles) > 0 {
		message = "以下のフォルダが移動できませんでした\n" + strings.Join(errFiles, " , ")
	}
	ctx.JSON(http.StatusOK, gin.H{"message": message})
}