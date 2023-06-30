package auth

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func (a Authcontroller) Logout(ctx *gin.Context) {
	session := sessions.Default(ctx)
	user := session.Get(a.SessionKey)
	if user == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session token"})
		return
	}
	session.Delete(a.SessionKey)
	session.Save()
	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}
