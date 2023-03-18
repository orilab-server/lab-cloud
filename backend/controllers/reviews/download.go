package reviews

import (
	"backend/models"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (r ReviewsController) DownloadReviewFile(ctx *gin.Context) {
	reviewId := ctx.Param("review-id")
	fileId := ctx.Param("file-id")
	reviewedFile, _ := models.FindReviewedFile(r.ModelCtx, r.MyDB, fileId)
	reviewed, _ := models.FindReviewed(r.ModelCtx, r.MyDB, reviewedFile.ReviewedID)
	extension := filepath.Ext(reviewedFile.FileName)
	fileName := fileId+extension
	targetPath := r.ReviewDirPath+"/"+reviewId+"/"+strconv.Itoa(reviewed.UserID)+"/"+fileName
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Disposition", "attachment; filename="+fileName)
	ctx.Header("Content-Type", "application/octet-stream")
	ctx.File(targetPath)
}