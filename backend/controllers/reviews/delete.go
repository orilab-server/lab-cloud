package reviews

import (
	"backend/models"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/koron/go-dproxy"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (r ReviewsController) DeleteReviewFile(ctx *gin.Context) {
	reviewID := ctx.Param("review-id")
	fileID := ctx.Param("file-id")
	reviewedFile, err := models.FindReviewedFile(r.ModelCtx, r.MyDB, fileID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "cannot find file",
		})
		return
	}

	// 別ユーザーが作成したファイルは削除できない
	reviewed, _ := models.FindReviewed(r.ModelCtx, r.MyDB, reviewedFile.ReviewedID)
	userID := reviewed.UserID
	session := sessions.Default(ctx)
	jsonLoginUser, err := dproxy.New(session.Get(r.SessionKey)).String()
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{})
		return
	}
	json.Unmarshal([]byte(jsonLoginUser), &loginUser)
	if userID != loginUser.ID {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "You don't have permission to delete file",
		})
		return
	}

	// 1. レビューコメントを削除
	models.ReviewComments(qm.Where("reviewed_file_id", fileID)).DeleteAll(r.ModelCtx, r.MyDB)
	// 2. レビュワーの人々を削除
	models.Reviewers(qm.Where("reviewed_file_id", fileID)).DeleteAll(r.ModelCtx, r.MyDB)
	// 3. レビューファイルを削除
	reviewedFile.Delete(r.ModelCtx, r.MyDB)
	// 4. ファイル削除
	fileExt := filepath.Ext(reviewedFile.FileName)
	filePath := r.ReviewDirPath + "/" + reviewID + "/" + strconv.Itoa(userID) + "/" + reviewedFile.ID + fileExt
	if _, err := os.Stat(filePath); err == nil {
		os.Remove(filePath)
	}

	ctx.JSON(http.StatusOK, gin.H{})
}
