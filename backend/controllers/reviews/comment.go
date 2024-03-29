package reviews

import (
	"backend/models"
	"backend/tools"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (r ReviewsController) PostComment(ctx *gin.Context) {
	fileId := ctx.Param("file-id")
	userId, _ := strconv.Atoi(ctx.PostForm("userId"))
	comment := ctx.PostForm("comment")
	pageNumber, _ := strconv.Atoi(ctx.Param("index"))
	reviewerExist, err := models.Reviewers(qm.Where("reviewed_file_id=?", fileId), qm.Where("user_id=?", userId)).Exists(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	// 初投稿レビュワーを登録
	if !reviewerExist {
		reviewerId, _ := uuid.NewUUID()
		newReviewer := models.Reviewer{
			ID:             reviewerId.String(),
			ReviewedFileID: fileId,
			UserID:         userId,
		}
		newReviewer.Insert(r.ModelCtx, r.MyDB, boil.Infer())
		id, _ := uuid.NewUUID()
		reviewComment := models.ReviewComment{
			ID:             id.String(),
			ReviewedFileID: fileId,
			ReviewerID:     reviewerId.String(),
			Comment:        comment,
			PageNumber:     pageNumber,
		}
		err := reviewComment.Insert(r.ModelCtx, r.MyDB, boil.Infer())
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{})
			return
		}
		ctx.JSON(http.StatusAccepted, gin.H{})
		return
	}
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	id, _ := uuid.NewUUID()
	reviewer, _ := models.Reviewers(qm.Where("reviewed_file_id=?", fileId), qm.Where("user_id=?", userId)).One(r.ModelCtx, r.MyDB)
	// 投稿内容を更新
	commentExist, _ := models.ReviewComments(qm.Where("reviewed_file_id=?", fileId), qm.Where("reviewer_id=?", reviewer.ID), qm.Where("page_number=?", pageNumber)).Exists(r.ModelCtx, r.MyDB)
	if commentExist {
		models.ReviewComments(qm.Where("reviewed_file_id=?", fileId), qm.Where("reviewer_id=?", reviewer.ID), qm.Where("page_number=?", pageNumber)).UpdateAll(
			r.ModelCtx,
			r.MyDB,
			models.M{
				"comment": comment,
			},
		)
		ctx.JSON(http.StatusAccepted, gin.H{})
		return
	}
	reviewComment := models.ReviewComment{
		ID:             id.String(),
		ReviewedFileID: fileId,
		ReviewerID:     reviewer.ID,
		Comment:        comment,
		PageNumber:     pageNumber,
	}
	err = reviewComment.Insert(r.ModelCtx, r.MyDB, boil.Infer())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	ctx.JSON(http.StatusAccepted, gin.H{})
}

type ResponseComment struct {
	ID         string `json:"id"`
	PageNumber int    `json:"index"`
	Comment    string `json:"comment"`
	CreatedAt  string `json:"created_at"`
}

func (r ReviewsController) GetComment(ctx *gin.Context) {
	fileId := ctx.Param("file-id")
	reviewerId := ctx.Param("reviewer-id")
	pageNumber := ctx.Param("index")
	comment, err := models.ReviewComments(qm.Where("reviewed_file_id=?", fileId), qm.Where("reviewer_id=?", reviewerId), qm.Where("page_number=?", pageNumber)).One(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusAccepted, gin.H{
			"comment": nil,
		})
		return
	}
	jst, _ := tools.FixToJstLocale(comment.CreatedAt)
	resopnse := ResponseComment{ID: comment.ID, PageNumber: comment.PageNumber, Comment: comment.Comment, CreatedAt: jst.Format("2006/01/02 15/04")}
	ctx.JSON(http.StatusOK, gin.H{
		"comment": resopnse,
	})
}

func (r ReviewsController) GetOwnComment(ctx *gin.Context) {
	fileId := ctx.Param("file-id")
	userId, _ := strconv.Atoi(ctx.Param("user-id"))
	reviewer, _ := models.Reviewers(qm.Where("reviewed_file_id=?", fileId), qm.Where("user_id=?", userId)).One(r.ModelCtx, r.MyDB)
	pageNumber := ctx.Param("index")
	exists, err := models.ReviewComments(qm.Where("reviewed_file_id=?", fileId), qm.Where("reviewer_id=?", reviewer.ID), qm.Where("page_number=?", pageNumber)).Exists(r.ModelCtx, r.MyDB)
	if !exists || err != nil {
		ctx.JSON(http.StatusAccepted, gin.H{
			"comment": nil,
		})
		return
	}
	c, err := models.ReviewComments(qm.Where("reviewed_file_id=?", fileId), qm.Where("reviewer_id=?", reviewer.ID), qm.Where("page_number=?", pageNumber)).One(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusAccepted, gin.H{
			"comment": nil,
		})
		return
	}
	jst, _ := tools.FixToJstLocale(c.CreatedAt)
	resopnse := ResponseComment{ID: c.ID, PageNumber: c.PageNumber, Comment: c.Comment, CreatedAt: jst.Format("2006/01/02 15/04")}
	ctx.JSON(http.StatusOK, gin.H{
		"comment": resopnse,
	})
}
