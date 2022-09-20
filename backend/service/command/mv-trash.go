package command_service

import (
	"backend/db"
	files_trash_table "backend/db/files_trash"
	"database/sql"
	"fmt"
	"os"
	"strings"

	"github.com/google/uuid"
)

type MvTrashRequest struct {
	MyDB        *sql.DB
	TrashDir    string
}

func (p MvTrashRequest) MvTrash(path string, itemType string) error {
	lastName := path[strings.LastIndex(path,"/")+1:]
	id, _ := uuid.NewUUID()
	_, err := files_trash_table.InsertRow(p.MyDB, db.InsertQueryParam{From: "files_trash",Column: []string{"id","user_id","type","past_location"}, Values: []any{id,1,itemType,path}})
	if err != nil {
		return err
	}
	if err := os.Rename(path, p.TrashDir+"/"+lastName); err != nil {
		fmt.Println(err)
		return err
	}
	return fmt.Errorf("error: command not found")
}