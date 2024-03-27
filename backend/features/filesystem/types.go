package filesystem

import (
	"backend/tools"
	"context"
	"database/sql"
)

type ObjectType int

type Controller struct {
	ImportantDirs []string
	SessionKey    string
	ShareDir      string
	TrashDir      string
	Items         tools.StorageItem
	MyDB          *sql.DB
}

type Service struct {
	ShareDir string
	MyDB     *sql.DB
	Ctx      context.Context
}
