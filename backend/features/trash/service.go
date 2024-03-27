package trash

import (
	"backend/db/models"
	"github.com/volatiletech/null"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries/qm"
	"net/http"
)

func (ts Service) FindTrashObjects() (TrashObjectsResponse, error) {
	trashes, err := models.Trashes(
		qm.Load(qm.Rels(models.TrashRels.File, models.FileRels.User)),
		qm.Load(qm.Rels(models.TrashRels.Dir, models.FileRels.User)),
		qm.Where("is_delete = ?", false),
	).All(ts.Ctx, ts.MyDB)
	if err != nil {
		return TrashObjectsResponse{}, err
	}
	return newTrashResponse(trashes), nil
}

func (ts Service) FindTrashObjectsInDir(dirId string) (TrashObjectsResponse, error) {
	files, err := models.Files(
		qm.Load(models.FileRels.User),
		qm.Where("dir_id = ?", dirId),
	).All(ts.Ctx, ts.MyDB)
	if err != nil {
		return TrashObjectsResponse{}, err
	}
	dirs, err := models.Dirs(
		qm.Load(models.DirRels.User),
		qm.Where("parent_id = ?", dirId),
	).All(ts.Ctx, ts.MyDB)
	if err != nil {
		return TrashObjectsResponse{}, err
	}
	return newTrashResponseFromFilesAndDirs(files, dirs), nil
}

func (ts Service) RestoreFromTrash(body RestoreRequest) (int, error, string) {
	if _, err := models.Trashes(
		models.TrashWhere.ID.IN(body.TrashIDs),
	).DeleteAll(ts.Ctx, ts.MyDB); err != nil {
		return http.StatusInternalServerError, err, "Failed to restore objects"
	}
	return http.StatusOK, nil, "Successfully restore objects"
}

func (ts Service) DeleteFromTrash(body DeleteRequest) (int, error, string) {
	if _, err := models.Trashes(
		models.TrashWhere.ID.IN(body.TrashIDs),
	).UpdateAll(ts.Ctx, ts.MyDB, models.M{"is_delete": true}); err != nil {
		return http.StatusInternalServerError, err, "Failed to delete objects"
	}
	return http.StatusOK, nil, "Successfully delete objects"
}

func (ts Service) MoveToTrash(body MoveToTrashRequest) (int, error, string) {
	tx, err := ts.MyDB.BeginTx(ts.Ctx, nil)
	if err != nil {
		return http.StatusInternalServerError, err, "Failed to start DB Transaction"
	}
	for _, id := range body.DirIDs {
		dir := models.Trash{
			DirID: null.NewString(id, true),
		}
		if err = dir.Insert(ts.Ctx, tx, boil.Infer()); err != nil {
			_ = tx.Rollback()
			return http.StatusInternalServerError, err, "Failed to DB Transaction"
		}
	}
	for _, id := range body.FileIDs {
		file := models.Trash{
			FileID: null.NewString(id, true),
		}
		if err = file.Insert(ts.Ctx, tx, boil.Infer()); err != nil {
			_ = tx.Rollback()
			return http.StatusInternalServerError, err, "Failed to DB Transaction"
		}
	}
	if err = tx.Commit(); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to commit DB Transaction"
	}
	return http.StatusOK, nil, "Successfully move objects to trash"
}
