package auth

import (
	"backend/httpUtils"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
)

// Login
// @Description Login
// @Tags Auth
// @Accept json
// @Produce json
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /login [post]
func (ac Controller) Login(ctx *gin.Context) {
	var body LoginRequest
	if err := ctx.ShouldBind(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Failed to login")
		return
	}
	service := getService(ac)
	session := sessions.Default(ctx)
	setSession := func(loginUser []byte) error {
		session.Set(ac.SessionKey, loginUser)
		return session.Save()
	}
	status, err, msg := service.Login(body, setSession)
	if err != nil {
		//	TODO: ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// Logout
// @Description Logout
// @Tags Auth
// @Accept json
// @Produce json
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /logout [post]
func (ac Controller) Logout(ctx *gin.Context) {
	session := sessions.Default(ctx)
	user := session.Get(ac.SessionKey)
	if user == nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Session is not found")
		return
	}
	session.Delete(ac.SessionKey)
	err := session.Save()
	if err != nil {
		httpUtils.MessageResponse(ctx, http.StatusInternalServerError, "Failed to save session")
		return
	}
	httpUtils.MessageResponse(ctx, http.StatusOK, "Successfully logged out")
}

// PostRequestRegister
// @Description Request registration
// @Tags Auth
// @Accept json
// @Produce json
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /register-requests [post]
func (ac Controller) PostRequestRegister(ctx *gin.Context) {
	var body RegisterRequest
	if err := ctx.ShouldBind(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	service := getService(ac)
	status, err, msg := service.RequestRegister(body)
	if err != nil {
		//	TODO: ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// GetRegisterRequests
// @Description Get registration requests
// @Tags Auth
// @Accept json
// @Produce json
// @Success 200 {object} models.RegisterRequestSlice
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /register-requests [get]
func (ac Controller) GetRegisterRequests(ctx *gin.Context) {
	service := getService(ac)
	requests, err := service.FindRegisterRequests()
	if err != nil {
		httpUtils.MessageResponse(ctx, http.StatusInternalServerError, "Found not register requests")
		return
	}
	ctx.JSON(http.StatusOK, requests)
}

// AcceptRegisterRequests
// @Description AcceptRegisterRequests
// @Tags Auth
// @Accept json
// @Produce json
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /accept-requests [post]
func (ac Controller) AcceptRegisterRequests(ctx *gin.Context) {
	var body AcceptRegisterRequest
	if err := ctx.ShouldBind(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	service := getService(ac)
	status, err, msg := service.AcceptRegisterRequests(body)
	if err != nil {
		//	TODO: ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}
