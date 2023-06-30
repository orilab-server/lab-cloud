package auth

import (
	"backend/models"
	"context"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

func (a Authcontroller) RequestRegister(ctx *gin.Context) {
	name := ctx.PostForm("name")
	email := strings.TrimSpace(ctx.PostForm("email"))
	grade, _ := strconv.Atoi(ctx.PostForm("grade"))
	m_ctx := context.Background()
	request := models.RegisterRequest{
		Name:  name,
		Email: email,
		Grade: grade,
	}
	if err := request.Insert(m_ctx, a.MyDB, boil.Infer()); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{})
}

func (a Authcontroller) GetRegisterRequests(ctx *gin.Context) {
	requests, err := models.RegisterRequests().All(context.Background(), a.MyDB)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"requests": requests,
	})
}
