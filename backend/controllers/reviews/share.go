package reviews

import (
	"backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (r ReviewsController) PostShareReview(ctx *gin.Context) {
	fileId := ctx.Param("file-id")
	userId, _ := strconv.Atoi(ctx.Param("user-id"))
	reviewer, err := models.Reviewers(qm.Where("reviewed_file_id=?", fileId), qm.Where("user_id=?", userId)).One(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	commentsExist, _ := models.ReviewComments(qm.Where("reviewed_file_id=?", fileId), qm.Where("reviewer_id=?", reviewer.ID)).Exists(r.ModelCtx, r.MyDB)
	if !commentsExist {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "there are no comments",
		})
		return
	}
	comments, err := models.ReviewComments(qm.Where("reviewed_file_id=?", fileId), qm.Where("reviewer_id=?", reviewer.ID), qm.OrderBy("page_number")).All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	reviewed, _ := models.Revieweds(qm.Where("review_id=?", ctx.Param("review-id")),qm.Where("user_id=?", userId)).One(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	reviewedUser, err := models.FindUser(r.ModelCtx, r.MyDB, reviewed.UserID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	reviewerUser, err := models.FindUser(r.ModelCtx, r.MyDB, reviewer.UserID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	reviewName := ctx.PostForm("reviewName")
	reviewedFile, err := models.FindReviewedFile(r.ModelCtx, r.MyDB, fileId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	msg := "" +
		"From: " + r.MailInfo.From + "\r\n" +
		"To: " + reviewedUser.Email + "\r\n" +
		"Subject: 件名 " + " ["+reviewName+"] " + reviewerUser.Name + "のレビュー\r\n" +
		"\r\n" +
		"\r\n" +
		reviewerUser.Name + "が " + reviewedFile.FileName + " にコメントしました" +
		"\r\n" +
		"\r\n" +
		"============================" +
		"\r\n" +
		"\r\n" +
		""
	for _, comment := range comments {
		page := strconv.Itoa(comment.PageNumber)+"ページ目のコメント\r\n\r\n"
		msg += page + comment.Comment + "\r\n\r\n" + "-----------------------------" + "\r\n\r\n"
	}
	r.MailInfo.SendOptional([]byte(msg), reviewedUser.Email)
	ctx.JSON(http.StatusAccepted, gin.H{})
}