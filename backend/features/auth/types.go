package auth

import (
	"backend/tools"
	"context"
	"database/sql"
)

type Controller struct {
	MyDB       *sql.DB
	SessionKey string
	MailInfo   tools.MailRequest
	SiteUrl    string
}

type Service struct {
	MyDB       *sql.DB
	SessionKey string
	MailInfo   tools.MailRequest
	SiteUrl    string
	ctxBack    context.Context
}
