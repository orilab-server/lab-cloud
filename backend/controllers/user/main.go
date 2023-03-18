package user

import (
	"backend/models"
	"backend/tools"
	"database/sql"
)

type UserController struct {
	MyDB       *sql.DB
	ShareDir   string
	SessionKey string
	Url string
	MailInfo tools.MailRequest
}

var loginUser models.User