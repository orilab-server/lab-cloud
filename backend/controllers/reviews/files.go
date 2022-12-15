package reviews

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (r ReviewsController) GetFilesController(ctx *gin.Context) {
	reviewedId := ctx.Param("reviewed-id")
	files, err := models.ReviewedFiles(qm.Where("reviewed_id=?", reviewedId)).All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	reviewed, err:= models.Revieweds(qm.Select("user_id"), qm.Where("id=?", reviewedId)).One(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"files": files,
		"user_id": reviewed.UserID,
	})
}