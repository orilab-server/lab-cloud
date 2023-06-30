package reviews

import (
	"backend/models"
	"backend/tools"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type ResponseFileType struct {
	ID            string `json:"id"`
	UserID        int    `json:"user_id"`
	UserName      string `json:"user_name"`
	CreatedAt     string `json:"created_at"`
	FileName      string `json:"file_name"`
	ReviewerCount int    `json:"reviewer_count"`
}

func (r ReviewsController) GetReviewFiles(ctx *gin.Context) {
	reviewId := ctx.Param("review-id")
	revieweds, err := models.Revieweds(qm.Where("review_id=?", reviewId)).All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	var responseFiles []ResponseFileType
	for _, reviewed := range revieweds {
		files, err := models.ReviewedFiles(qm.Where("reviewed_id=?", reviewed.ID), qm.OrderBy("created_at desc")).All(r.ModelCtx, r.MyDB)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{})
			return
		}
		for _, file := range files {
			reviewed, _ := models.FindReviewed(r.ModelCtx, r.MyDB, file.ReviewedID)
			user, _ := models.FindUser(r.ModelCtx, r.MyDB, reviewed.UserID)
			reviewerCount, _ := models.Reviewers(qm.Where("reviewed_file_id=?", file.ID)).Count(r.ModelCtx, r.MyDB)
			// DBで保存している時刻のlocaleを日本に修正
			createdAtJst, _ := tools.FixToJstLocale(file.CreatedAt)
			createdAt := createdAtJst.Format("2006/01/02 15:04")
			responseFile := ResponseFileType{
				ID:            file.ID,
				UserID:        user.ID,
				UserName:      user.Name,
				CreatedAt:     createdAt,
				FileName:      file.FileName,
				ReviewerCount: int(reviewerCount),
			}
			responseFiles = append(responseFiles, responseFile)
		}
	}
	ctx.JSON(http.StatusOK, gin.H{
		"files": responseFiles,
	})
}

func (r ReviewsController) GetTeacherFiles(ctx *gin.Context) {
	reviewedId := ctx.Param("reviewed-id")
	files, err := models.TeacherReviewedFiles(qm.Where("reviewed_id=?", reviewedId), qm.OrderBy("created_at desc")).All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	reviewed, err := models.Revieweds(qm.Select("user_id"), qm.Where("id=?", reviewedId)).One(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"files":   files,
		"user_id": reviewed.UserID,
	})
}
