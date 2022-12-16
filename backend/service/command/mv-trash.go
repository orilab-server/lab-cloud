package command_service

import (
	"backend/models"
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type MvTrashRequest struct {
	MyDB        *sql.DB
	TrashDir    string
	UserId      int
}

func (p MvTrashRequest) MvTrash(path string, itemType string) error {
	lastName := path[strings.LastIndex(path,"/")+1:]
	newPath := p.TrashDir+"/"+lastName
	modelCtx := context.Background()
	filesCount, err := models.FilesTrashes(qm.Where("current_location=?", newPath)).Count(modelCtx, p.MyDB)
	if err != nil {
		return err
	}
	// ファイルに重複があった場合は "ファイル名_(ファイルの個数+1)"
	if filesCount > 0 {
		if itemType == "file" {
			// 拡張子との間に _(ファイルの個数+1) を入れている
			newPath = strings.Replace(newPath, ".", "_"+strconv.Itoa(int(filesCount)+1)+".", 1)
		} else {
			newPath = fmt.Sprintf("%s_%d", newPath, filesCount+1)
		}
	}
	id, _ := uuid.NewUUID()
	filesTrash := models.FilesTrash{
		ID: id.String(),
		UserID: p.UserId,
		Type: itemType,
		CurrentLocation: newPath,
		PastLocation: path,
	}
	if err = filesTrash.Insert(modelCtx, p.MyDB, boil.Infer()); err != nil {
		return err
	}
	if err := os.Rename(path, newPath); err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}