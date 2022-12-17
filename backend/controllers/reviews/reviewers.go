package reviews

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type ResponseType struct {
	Id string `json:"id"`
	UserId int `json:"userId"`
	Name string `json:"name"`
}

func (r ReviewsController) GetReviewersController(ctx *gin.Context) {
	fileId := ctx.Param("file-id")
	reviewers, err := models.Reviewers(qm.Where("reviewed_file_id=?", fileId)).All(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	var responses []ResponseType
	for _, reviewer := range reviewers {
		user, _ := models.Users(qm.Select("name"), qm.Where("id=?", reviewer.UserID)).One(r.ModelCtx, r.MyDB)
		responses = append(responses, ResponseType{Id: reviewer.ID, UserId: reviewer.UserID, Name: user.Name})
	}
	ctx.JSON(http.StatusOK, gin.H{
		"reviewers": responses,
	})
}