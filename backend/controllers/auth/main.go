package auth

import (
	"backend/tools"
	"database/sql"
)

type Authcontroller struct {
	MyDB       *sql.DB
	SessionKey string
	MailInfo   tools.MailRequest
	SiteUrl    string
}
