package reviews

import (
	"backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (r ReviewsController) PostShareReviewController(ctx *gin.Context) {
	fileId := ctx.Param("file-id")
	reviewerId := ctx.Param("reviewer-id")
	comments, err := models.ReviewComments(qm.Where("reviewed_file_id=?", fileId), qm.Where("reviewer_id=?", reviewerId), qm.OrderBy("page_number")).All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	reviewer, err := models.FindReviewer(r.ModelCtx, r.MyDB, reviewerId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	reviewedId := ctx.Param("reviewed-id")
	reviewed, err := models.FindReviewed(r.ModelCtx, r.MyDB, reviewedId)
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
	msg := "" +
		"From: " + r.MailInfo.From + "\r\n" +
		"To: " + reviewedUser.Email + "\r\n" +
		"Subject: 件名 " + " ["+reviewName+"] " + reviewerUser.Name + "のレビュー\r\n" +
		"\r\n" +
		"\r\n" +
		reviewerUser.Name + "がコメントしました" +
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
	r.MailInfo.Send([]byte(msg))
	ctx.JSON(http.StatusAccepted, gin.H{})
}