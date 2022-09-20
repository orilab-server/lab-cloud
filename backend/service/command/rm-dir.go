package command_service

import (
	"backend/db"
	files_trash_table "backend/db/files_trash"
	"database/sql"
	"fmt"
	"os"
)

type RmDirRequest struct {
	MyDB        *sql.DB
	TrashDir    string
}

func (r RmDirRequest) RmDir(path string, id string) error {
	_, err := files_trash_table.DeleteRow(r.MyDB, db.DeleteQueryParam{From: "files_trash", Where: map[string]any{"id": id}})
	if err != nil {
		return err
	}
	if err := os.RemoveAll(path); err != nil {
		fmt.Println(err)
		return err
	}
	return fmt.Errorf("error: command not found")
}