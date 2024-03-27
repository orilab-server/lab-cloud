package user

import (
	"backend/tools"
	"context"
	"database/sql"
)

type UserController struct {
	MyDB       *sql.DB
	ShareDir   string
	SessionKey string
	Url        string
	MailInfo   tools.MailRequest
}

type UserService struct {
	MyDB       *sql.DB
	ShareDir   string
	SessionKey string
	Url        string
	MailInfo   tools.MailRequest
	CxtBack    context.Context
}

type UserResponse struct {
	UserID      string `json:"userId"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Grade       int    `json:"grade"`
	IsLogin     bool   `json:"isLogin"`
	IsTemporary bool   `json:"isTemporary"`
}
