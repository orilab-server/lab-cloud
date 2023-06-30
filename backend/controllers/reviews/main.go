package reviews

import (
	"backend/models"
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
	MyDB            *sql.DB
	ModelCtx        context.Context
	ReviewDirPath   string
	LineNotifyToken string
	MailInfo        tools.MailRequest
	SessionKey      string
}

type ResponseReview struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Target int    `json:"target"`
	Year   int    `json:"year"`
}

var loginUser models.User

func (r ReviewsController) GetIsTarget(ctx *gin.Context) {
	reviewId := ctx.Param("review-id")
	userId, _ := strconv.Atoi(ctx.Param("user-id"))
	revieweds, _ := models.Revieweds(qm.Where("review_id=?", reviewId)).All(r.ModelCtx, r.MyDB)
	for _, reviewed := range revieweds {
		if userId == reviewed.UserID {
			ctx.JSON(http.StatusOK, gin.H{
				"isTarget": true,
			})
			return
		}
	}
	ctx.JSON(http.StatusOK, gin.H{
		"isTarget": false,
	})
}

func (r ReviewsController) GetIsReviewHost(ctx *gin.Context) {
	fileId := ctx.Param("file-id")
	userId, _ := strconv.Atoi(ctx.Param("user-id"))
	file, _ := models.FindReviewedFile(r.ModelCtx, r.MyDB, fileId)
	reviewedExists, err := models.Revieweds(qm.Where("id=?", file.ReviewedID)).Exists(r.ModelCtx, r.MyDB)
	if !reviewedExists || err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"isHost": false,
		})
		return
	}
	reviewed, _ := models.FindReviewed(r.ModelCtx, r.MyDB, file.ReviewedID)
	if reviewed.UserID == userId {
		ctx.JSON(http.StatusOK, gin.H{
			"isHost": true,
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"isHost": false,
	})
}

func (r ReviewsController) GetReviews(ctx *gin.Context) {
	reviews, err := models.Reviews().All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	var responseReviews []ResponseReview
	for _, review := range reviews {
		createdAtJst, _ := tools.FixToJstLocale(review.CreatedAt)
		year := createdAtJst.Year()
		month := int(createdAtJst.Month())
		if 1 <= month && month <= 3 {
			year = year - 1
		}
		responseReview := ResponseReview{ID: review.ID, Name: review.Name, Target: review.Target, Year: year}
		responseReviews = append(responseReviews, responseReview)
	}
	ctx.JSON(http.StatusOK, gin.H{
		"reviews": responseReviews,
	})
}

// param : reviewName(レビュー名), userIds(対象者のid), targetGrade(対象学年)
func (r ReviewsController) CreateReview(ctx *gin.Context) {
	reviewName := ctx.PostForm("reviewName")
	targetGrade, _ := strconv.Atoi(ctx.PostForm("targetGrade"))
	reviewId, _ := uuid.NewUUID()
	newReviewName := reviewName + "_" + tools.GradeStrFromNumber(targetGrade)
	review := models.Review{ID: reviewId.String(), Name: newReviewName, Target: targetGrade}
	err := review.Insert(r.ModelCtx, r.MyDB, boil.Infer())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to register review",
		})
		return
	}
	newReview := r.ReviewDirPath + "/" + reviewId.String()
	if err := os.Mkdir(newReview, 0777); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to create review dir",
		})
		return
	}
	// レビュー対象者がカスタムの場合
	if targetGrade == 6 {
		userIds := strings.Split(ctx.PostForm("userIds"), ",")
		for _, strUserId := range userIds {
			userId, _ := strconv.Atoi(strUserId)
			user, _ := models.FindUser(r.ModelCtx, r.MyDB, userId)
			reviewedId, _ := uuid.NewUUID()
			reviewed := models.Reviewed{
				ID:       reviewedId.String(),
				ReviewID: reviewId.String(),
				UserID:   userId,
			}
			// 各個人ディレクトリの名前はユーザIDにする(名前変更した際にも対応するため)
			if err := os.Mkdir(newReview+"/"+strUserId, 0777); err != nil {
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
		return
	}
	now := time.Now()
	year := now.Year()
	// month -> Febrary, January, ... のフォーマット
	month := int(now.Month())
	// 1月 ~ 3月は前年度のため
	if 1 <= month && month <= 3 {
		year = year - 1
	}
	grade := year - targetGrade
	users, err := models.Users(models.UserWhere.Grade.EQ(grade)).All(r.ModelCtx, r.MyDB)
	for _, user := range users {
		reviewedId, _ := uuid.NewUUID()
		reviewed := models.Reviewed{
			ID:       reviewedId.String(),
			ReviewID: reviewId.String(),
			UserID:   user.ID,
		}
		if err := os.Mkdir(newReview+"/"+strconv.Itoa(user.ID), 0777); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "failed to create reviewed user dir: " + user.Name,
			})
			return
		}
		// make for teacher directory
		if err := os.Mkdir(newReview+"/"+strconv.Itoa(user.ID)+"/teacher", 0777); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "failed to create reviewed teacher dir: " + user.Name,
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
	Id   string `json:"id"`
	Name string `json:"name"`
}
