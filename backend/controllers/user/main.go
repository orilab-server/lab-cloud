package user

import (
	"backend/models"
	mailservice "backend/service/mail_service"
	"database/sql"
)

type UserController struct {
	MyDB       *sql.DB
	ShareDir   string
	SessionKey string
	Url string
	MailInfo mailservice.MailRequest
}

var loginUser models.User