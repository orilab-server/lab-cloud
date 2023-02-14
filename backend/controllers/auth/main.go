package auth

import (
	mailservice "backend/service/mail_service"
	"database/sql"
)

type Authcontroller struct {
	MyDB       *sql.DB
	SessionKey string
	MailInfo   mailservice.MailRequest
	SiteUrl    string
}
