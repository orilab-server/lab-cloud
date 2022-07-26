package controllers

import (
	"backend/db"
	users_table "backend/db/users"
	"backend/tools"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)


type Authcontroller struct {
	MyDB *sql.DB
	SessionKey string
}

func (a Authcontroller) LoginController(ctx *gin.Context) {
	email := strings.TrimSpace(ctx.PostForm("email"))
	password := strings.TrimSpace(ctx.PostForm("password"))
	if email == "" || password == "" {
		ctx.Status(http.StatusBadRequest)
	} else {
		user, err := users_table.SelectRow(a.MyDB, db.SelectQueryParam{From: "users",Column: []string{"*"},Where: map[string]any{"email":email}})
		if err != nil {
			ctx.Status(http.StatusBadRequest)
			return
		}
		// compare with hash and pass 
		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Wrong password",
			})
		} else {
			session := sessions.Default(ctx)
			// convert user info to save session
			loginUser, err := json.Marshal(user)
			if err == nil {
				session.Set(a.SessionKey, string(loginUser))
				session.Save()
				ctx.JSON(http.StatusOK, gin.H{
					"message": "Successfully logged in",
				})
			} else {
				ctx.Status(http.StatusInternalServerError)
			}
		}
	}
}

func (a Authcontroller) LogoutController(ctx *gin.Context) {
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

// admin registerd -> make user change the password
func (a Authcontroller) SignUpController(ctx *gin.Context) {
	randStr, err := tools.GetRandomStr(10)
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}
	tempPassword := []byte(randStr)
	hashed, err := bcrypt.GenerateFromPassword(tempPassword, 10)
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
    }
	name := ctx.PostForm("name")
	email := ctx.PostForm("email")
	if _, err := users_table.InsertRow(a.MyDB, db.InsertQueryParam{From: "users",Column: []string{"name","password","email","is_temporary"},Values: []any{name,hashed,email,true}}); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "fail",
		})
		return
    }
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"password": randStr,
	})
}
