package trash

import (
	"backend/tools"
	"context"
	"database/sql"
)

type Controller struct {
	ImportantDirs []string
	ShareDir      string
	TrashDir      string
	Items         tools.StorageItem
	MyDB          *sql.DB
}

type Service struct {
	Ctx  context.Context
	MyDB *sql.DB
}
