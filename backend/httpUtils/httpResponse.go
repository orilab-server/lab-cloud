package httpUtils

import "github.com/gin-gonic/gin"

type MessageResponseType struct {
	Message string `json:"message"`
}

func MessageResponse(ctx *gin.Context, status int, msg string) {
	ctx.JSON(status, gin.H{
		"message": msg,
	})
}
