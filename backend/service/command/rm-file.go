package command_service

import (
	"backend/models"
	"context"
	"database/sql"
	"log"
	"os"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type RmFileRequest struct {
	MyDB        *sql.DB
	TrashDir    string
}

func (r RmFileRequest) RmFile(path string, id string) error {
	if _, err := models.FilesTrashes(qm.Where("id=?", id)).DeleteAll(context.Background(), r.MyDB); err != nil {
		log.Fatal(err)
		return err
	}
	if err := os.Remove(path); err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}