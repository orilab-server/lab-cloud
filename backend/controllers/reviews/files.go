package reviews

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type ResponseFileType struct {
	ID string `json:"id"`
	CreatedAt string `json:"created_at"`
	FileName string `json:"file_name"`
	ReviewerCount int `json:"reviewer_count"`
}

func (r ReviewsController) GetFilesController(ctx *gin.Context) {
	reviewedId := ctx.Param("reviewed-id")
	files, err := models.ReviewedFiles(qm.Where("reviewed_id=?", reviewedId), qm.OrderBy("created_at desc")).All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	var responseFiles []ResponseFileType
	for _, file := range files {
		reviewerCount, _ := models.Reviewers(qm.Where("reviewed_file_id=?", file.ID)).Count(r.ModelCtx, r.MyDB)
		responseFile := ResponseFileType{
			ID: file.ID,
			CreatedAt: file.CreatedAt.String(),
			FileName: file.FileName,
			ReviewerCount: int(reviewerCount),
		}
		responseFiles = append(responseFiles, responseFile)
	}
	reviewed, err:= models.Revieweds(qm.Select("user_id"), qm.Where("id=?", reviewedId)).One(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"files": responseFiles,
		"user_id": reviewed.UserID,
	})
}