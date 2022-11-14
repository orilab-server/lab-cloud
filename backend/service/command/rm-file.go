package command_service

import (
	"backend/db"
	files_trash_table "backend/db/files_trash"
	"database/sql"
	"fmt"
	"os"
)

type RmFileRequest struct {
	MyDB        *sql.DB
	TrashDir    string
}

func (r RmFileRequest) RmFile(path string, id string) error {
	dbErr := files_trash_table.DeleteRow(r.MyDB, db.DeleteQueryParam{From: "files_trash", Where: map[string]any{"id": id}})
	if err := os.Remove(path); err != nil {
		fmt.Println(err)
		fmt.Println(dbErr)
		return fmt.Errorf("error: %s, db error: %s", err, dbErr)
	}
	return nil
}