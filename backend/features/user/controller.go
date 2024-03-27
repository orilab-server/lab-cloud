package user

import (
	"backend/tools"
	"context"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strings"
)

func getUserService(uc UserController) UserService {
	return UserService{uc.MyDB, uc.ShareDir, uc.SessionKey, uc.Url, uc.MailInfo, context.Background()}
}

func (uc UserController) ChangePassword(ctx *gin.Context) {
	newPassword := strings.TrimSpace(ctx.PostForm("newPassword"))
	if newPassword == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Password is empty",
		})
		return
	}
	session := sessions.Default(ctx)
	loginUser, err := tools.GetLoginUser(session, uc.SessionKey)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get login user",
		})
		return
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), 10)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to hash password",
		})
		return
	}
	userService := getUserService(uc)
	if status, err, msg := userService.UpdatePassword(loginUser.Email, string(hashed)); err != nil {
		ctx.JSON(status, gin.H{
			"message": msg,
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Successfully change password",
	})
}

func (uc UserController) GetUsers(ctx *gin.Context) {
	userService := getUserService(uc)
	users, err := userService.FindAllUsers()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get all users",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func (uc UserController) GetUser(ctx *gin.Context) {
	session := sessions.Default(ctx)
	loginUser, err := tools.GetLoginUser(session, uc.SessionKey)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get login user",
		})
		return
	}
	userService := getUserService(uc)
	user, err := userService.FindUserByEmail(loginUser.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "User not found. email: " + user.Email,
		})
	}
	userResponse := UserResponse{
		UserID:      user.ID,
		IsTemporary: user.IsTemporary,
		IsLogin:     true,
		Name:        user.Name,
		Email:       user.Email,
		Grade:       user.Grade,
	}
	ctx.JSON(http.StatusOK, userResponse)
}

func (uc UserController) ChangeUsername(ctx *gin.Context) {
	newName := strings.TrimSpace(ctx.PostForm("newName"))
	if newName == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Name is empty",
		})
		return
	}
	userService := getUserService(uc)
	session := sessions.Default(ctx)
	loginUser, err := tools.GetLoginUser(session, uc.SessionKey)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get login user",
		})
		return
	}
	if err := userService.UpdateName(loginUser.Email, newName); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "user not found",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "successfully update username",
	})
}

func (uc UserController) ResetPasswordRequest(ctx *gin.Context) {
	email := strings.TrimSpace(ctx.PostForm("email"))
	if email == "" {
		ctx.Status(http.StatusBadRequest)
		return
	}
	userService := getUserService(uc)
	token, err := tools.GetRandomStr(254)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to generate random string",
		})
		return
	}
	if status, err, msg := userService.CreatePassword(email, token); err != nil {
		ctx.JSON(status, gin.H{
			"message": msg,
		})
		return
	}
	// リセット用リンクメールを送信
	msg := "" +
		"\r\n" +
		"\r\n" +
		"============================" +
		"\r\n" +
		"\r\n" +
		"こちらのリンクからパスワードを変更してください" +
		"\r\n" +
		uc.Url + "/reset-password?token=" + token +
		"\r\n" +
		"\r\n" +
		"※このリンクにアクセスするには大学のネットワークに接続している必要があります" +
		"\r\n" +
		""
	if err := uc.MailInfo.SendMail("[件名] パスワード変更メール", msg, email, []string{}); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "mail send error",
		})
	}
}

func (uc UserController) ResetPassword(ctx *gin.Context) {
	token := strings.TrimSpace(ctx.PostForm("token"))
	newPassword := strings.TrimSpace(ctx.PostForm("newPassword"))
	if token == "" || newPassword == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Name or NewPassword is empty",
		})
		return
	}
	userService := getUserService(uc)
	status, err, msg := userService.UpdatePasswordByResetToken(token, newPassword)
	if err != nil {
		ctx.JSON(status, gin.H{
			"message": msg,
		})
		return
	}
	ctx.JSON(status, gin.H{
		"message": msg,
	})
}
