package reviews

import (
	"backend/models"
	mailservice "backend/service/mail_service"
	"backend/tools"
	"context"
	"database/sql"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type ReviewsController struct {
	MyDB * sql.DB
	ModelCtx context.Context
	ReviewDirPath string
	LineNotifyToken string
	MailInfo mailservice.MailRequest
}

func (r ReviewsController) GetReviewsController(ctx *gin.Context) {
	reviews, err := models.Reviews().All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"reviews": reviews,
	})
}

// param : reviewName(レビュー名), userIds(対象者のid), targetGrade(対象学年) 
func (r ReviewsController) PostReviewController(ctx *gin.Context) {
	reviewName := ctx.PostForm("reviewName")
	targetGrade, _ := strconv.Atoi(ctx.PostForm("targetGrade"))
	reviewId, _ := uuid.NewUUID()
	newReviewName := reviewName+"_"+tools.GradeStrFromNumber(targetGrade)
	review := models.Review{ID: reviewId.String(), Name: newReviewName, Target: targetGrade}
	err := review.Insert(r.ModelCtx, r.MyDB, boil.Infer())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to register review",
		})
		return
	}
	newReview := r.ReviewDirPath+"/"+newReviewName
	if err := os.Mkdir(newReview, 0777); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to create review dir",
		})
		return
	}
	// レビュー対象者がカスタムの場合
	if targetGrade == 6 {
		userIdAndNames := strings.Split(ctx.PostForm("userIdAndNames"), "/") // id1,氏名1/id2,氏名2 で分割
		for _, userIdAndName := range userIdAndNames {
			user := strings.Split(userIdAndName, ",")
			userId, _ := strconv.Atoi(user[0])
			reviewedId, _ := uuid.NewUUID()
			reviewed := models.Reviewed{
				ID: reviewedId.String(),
				ReviewID: reviewId.String(),
				UserID: userId,
			}
			if err := os.Mkdir(newReview+"/"+user[1], 0777); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"message": "failed to create reviewed user dir: " + user[1],
				})
				return
			}
			reviewed.Insert(r.ModelCtx, r.MyDB, boil.Infer())
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"message": "failed to register reviewed person",
				})
				return
			}
		}
		return
	}
	year, _, _ := time.Now().Date()
	grade := year - targetGrade
	users, err := models.Users(models.UserWhere.Grade.EQ(grade)).All(r.ModelCtx, r.MyDB)
	for _, user := range users {
		reviewedId, _ := uuid.NewUUID()
		reviewed := models.Reviewed{
			ID: reviewedId.String(),
			ReviewID: reviewId.String(),
			UserID: user.ID,
		}
		if err := os.Mkdir(newReview+"/"+strconv.Itoa(user.ID), 0777); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "failed to create reviewed user dir: " + user.Name,
			})
			return
		}
		reviewed.Insert(r.ModelCtx, r.MyDB, boil.Infer())
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "failed to register reviewed person",
			})
			return
		}
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

type Reviewed struct {
	Id string `json:"id"`
	Name string `json:"name"`
}

func (r ReviewsController) GetReviewedController(ctx *gin.Context) {
	reviewId := ctx.Param("review-id")
	reviewed, err := models.Revieweds(qm.Where("review_id=?", reviewId)).All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	var revieweds []Reviewed
	for _, rev := range reviewed {
		user, _ := models.Users(qm.Select("name"), qm.Where("id=?", rev.UserID)).One(r.ModelCtx, r.MyDB)
		target := Reviewed{Id: rev.ID, Name: user.Name}
		revieweds = append(revieweds, target)
	}
	ctx.JSON(http.StatusOK, gin.H{
		"revieweds": revieweds,
	})
}