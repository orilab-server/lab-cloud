package reviews

import (
	"backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (r ReviewsController) PostRegisterReviewer(ctx *gin.Context) {
	fileId := ctx.Param("file-id")
	userId, _ := strconv.Atoi(ctx.PostForm("userId"))
	reviewerExist, _ := models.Reviewers(qm.Where("reviewed_file_id=?", fileId), qm.Where("user_id=?", userId)).Exists(r.ModelCtx, r.MyDB)
	if reviewerExist {
		ctx.JSON(http.StatusConflict, gin.H{
			"message": "already exist",
		})
		return
	}
	id, _ := uuid.NewUUID()
	newReviewer := models.Reviewer{
		ID: id.String(),
		ReviewedFileID: fileId,
		UserID: userId,
	}
	err := newReviewer.Insert(r.ModelCtx, r.MyDB, boil.Infer())
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "failed to regiter reviewer",
		})
		return
	}
	ctx.JSON(http.StatusAccepted, gin.H{})
}