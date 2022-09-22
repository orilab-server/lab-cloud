package command_service

import (
	"backend/db"
	files_trash_table "backend/db/files_trash"
	"database/sql"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/google/uuid"
)

type MvTrashRequest struct {
	MyDB        *sql.DB
	TrashDir    string
}

func (p MvTrashRequest) MvTrash(path string, itemType string) error {
	lastName := path[strings.LastIndex(path,"/")+1:]
	newPath := p.TrashDir+"/"+lastName
	res, err := files_trash_table.SelectRows(p.MyDB, db.SelectQueryParam{From: "files_trash", Column: []string{"*"}, Where: map[string]any{"current_location": newPath}})
	if err != nil {
		return err
	}
	// ファイルに重複があった場合は "ファイル名_(ファイルの個数+1)"
	len := len(res)
	if len > 0 {
		if itemType == "file" {
			// 拡張子との間に _(ファイルの個数+1) を入れている
			newPath = strings.Replace(newPath, ".", "_"+strconv.Itoa(len+1)+".", 1)
		} else {
			newPath = fmt.Sprintf("%s_%d", newPath, len+1)
		}
	}
	id, _ := uuid.NewUUID()
	_, err = files_trash_table.InsertRow(p.MyDB, db.InsertQueryParam{From: "files_trash",Column: []string{"id","user_id","type","current_location","past_location"}, Values: []any{id,1,itemType,newPath,path}})
	if err != nil {
		return err
	}
	if err := os.Rename(path, newPath); err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}