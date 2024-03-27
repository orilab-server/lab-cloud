package filesystem

import (
	"backend/db/models"
	"context"
	"fmt"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries/qm"
	"io/fs"
	"net/http"
	"path/filepath"
	"time"
)

func (hs Service) FindFileSystemObjects(dirId string) (FileSystemObjectsResponse, error, string) {
	files, err := models.Files(
		qm.Load(models.FileRels.User),
		qm.Where("files.dir_id = ?", dirId),
		qm.LeftOuterJoin("trashes AS t ON files.id = t.file_id"),
		qm.Where("t.id IS NULL"),
	).All(context.Background(), hs.MyDB)
	if err != nil {
		return FileSystemObjectsResponse{}, err, "Failed to find files. dirId: " + dirId
	}
	dirs, err := models.Dirs(
		qm.Load(models.DirRels.User),
		qm.Where("dirs.parent_id = ?", dirId),
		qm.LeftOuterJoin("trashes AS t ON dirs.id = t.dir_id"),
		qm.Where("t.id IS NULL"),
	).All(context.Background(), hs.MyDB)
	if err != nil {
		return FileSystemObjectsResponse{}, err, "Failed to find dirs. dirId: " + dirId
	}
	return FileSystemObjectsResponse{
		Files: newFileResponseSlice(files),
		Dirs:  newDirResponseSlice(dirs),
	}, nil, ""
}

func (hs Service) CreateDir(dirModel *models.Dir, mkdirFunc func(location string) error) (int, error, string) {
	tx, err := hs.MyDB.BeginTx(hs.Ctx, nil)
	if err != nil {
		return http.StatusInternalServerError, err, "Failed to start DB Transaction"
	}
	parentDir, err := models.FindDir(hs.Ctx, tx, dirModel.ParentID.String)
	if err != nil {
		_ = tx.Rollback()
		return http.StatusNotFound, err, "Failed to find dir. dirId: " + dirModel.ParentID.String
	}
	location := parentDir.Location + "/" + parentDir.Name
	dirModel.Location = location
	if err = dirModel.Insert(hs.Ctx, tx, boil.Infer()); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to DB Transaction"
	}
	if err = mkdirFunc(location); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to create dir"
	}
	if err = tx.Commit(); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to commit DB Transaction"
	}
	return http.StatusOK, nil, "Successfully create dir"
}

func (hs Service) CreateFiles(dirId string, fileModels []models.File, uploadFunc func(destination string) error) (int, error, string) {
	tx, err := hs.MyDB.BeginTx(hs.Ctx, nil)
	if err != nil {
		return http.StatusInternalServerError, err, "Failed to start DB Transaction"
	}
	dir, err := models.FindDir(hs.Ctx, tx, dirId)
	if err != nil {
		_ = tx.Rollback()
		return http.StatusNotFound, err, "Dir not found. dirId: " + dirId
	}
	destination := dir.Location + "/" + dir.Name
	for _, model := range fileModels {
		model.Location = destination
		if err = model.Insert(hs.Ctx, tx, boil.Infer()); err != nil {
			_ = tx.Rollback()
			return http.StatusInternalServerError, err, "Failed to DB Transaction"
		}
	}
	if err := uploadFunc(destination); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to upload file"
	}
	if err = tx.Commit(); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to commit DB Transaction"
	}
	return http.StatusOK, nil, "Successfully upload file"
}

func (hs Service) CreateDirAndFiles(
	dirId string,
	dirModel models.Dir,
	fileModels []models.File,
	uploadFunc func(destination string) error,
) (int, error, string) {
	tx, err := hs.MyDB.BeginTx(hs.Ctx, nil)
	if err != nil {
		return http.StatusInternalServerError, err, "Failed to start DB Transaction"
	}
	dir, err := models.FindDir(hs.Ctx, tx, dirId)
	if err != nil {
		_ = tx.Rollback()
		return http.StatusNotFound, err, "Dir not found. dirId: " + dirId
	}
	destination := dir.Location + "/" + dir.Name
	dirModel.Location = destination
	if err = dirModel.Insert(hs.Ctx, tx, boil.Infer()); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to DB Transaction"
	}
	for _, model := range fileModels {
		model.Location = destination + "/" + dirModel.Name
		if err = model.Insert(hs.Ctx, tx, boil.Infer()); err != nil {
			_ = tx.Rollback()
			return http.StatusInternalServerError, err, "Failed to DB Transaction"
		}
	}
	if err := uploadFunc(destination); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to upload file"
	}
	if err = tx.Commit(); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to commit DB Transaction"
	}
	return http.StatusOK, nil, "Successfully create dir and upload files"
}

func (hs Service) ChangeName(id string, body ChangeNameRequest, renameFunc func(old, new string) error) (int, error, string) {
	tx, err := hs.MyDB.BeginTx(hs.Ctx, nil)
	if err != nil {
		return http.StatusInternalServerError, err, "Failed to start DB Transaction"
	}
	newName := body.NewName
	var oldFullPath, newFullPath string
	switch body.Type {
	case FILE:
		{
			file, err := models.Files(models.FileWhere.ID.EQ(id)).One(hs.Ctx, tx)
			if err != nil {
				_ = tx.Rollback()
				return http.StatusNotFound, err, "File not found. id: " + id
			}
			oldFullPath, newFullPath = file.Location+"/"+file.Name, file.Location+"/"+newName
			file.Name = newName
			if _, err = file.Update(hs.Ctx, tx, boil.Infer()); err != nil {
				_ = tx.Rollback()
				return http.StatusInternalServerError, err, "Failed to update filename"
			}
		}
	case DIR:
		{
			dir, err := models.FindDir(hs.Ctx, tx, id)
			if err != nil {
				_ = tx.Rollback()
				return http.StatusNotFound, err, "Dir not found. id: " + id
			}
			oldFullPath, newFullPath = dir.Location+"/"+dir.Name, dir.Location+"/"+newName
			dir.Name = newName
			if _, err = dir.Update(hs.Ctx, tx, boil.Infer()); err != nil {
				_ = tx.Rollback()
				return http.StatusInternalServerError, err, "Failed to update dirname"
			}
		}
	default:
		{
			return http.StatusBadRequest, fmt.Errorf("invalid object type"), "Invalid type in request body"
		}
	}
	if err = renameFunc(oldFullPath, newFullPath); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to change name"
	}
	if err = tx.Commit(); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to commit DB Transaction"
	}
	return http.StatusOK, nil, "Successfully update name"
}

func (hs Service) MoveDir(body MoveDirRequest, mvFunc func(old, new string) error) (int, error, string) {
	tx, err := hs.MyDB.BeginTx(hs.Ctx, nil)
	if err != nil {
		return http.StatusInternalServerError, err, "Failed to start DB Transaction"
	}
	toDir, err := models.FindDir(hs.Ctx, tx, body.ToDirId, "name", "location")
	if err != nil {
		return http.StatusNotFound, err, "Failed to find dir"
	}
	destination := toDir.Location + "/" + toDir.Name
	fileIds, dirIds := body.FileIDs, body.DirIDs
	type moveTarget struct {
		OldLocation string
		NewLocation string
	}
	moveTargetList := make([]moveTarget, len(fileIds)+len(dirIds))
	if len(fileIds) > 0 {
		files, err := models.Files(
			models.FileWhere.ID.IN(fileIds),
		).All(hs.Ctx, tx)
		if err != nil {
			_ = tx.Rollback()
			return http.StatusNotFound, err, "Failed to find files"
		}
		for i, file := range files {
			oldLocation, newLocation := file.Location+"/"+file.Name, destination+"/"+file.Name
			file.Location = destination
			_, err := file.Update(hs.Ctx, tx, boil.Infer())
			if err != nil {
				_ = tx.Rollback()
				return http.StatusInternalServerError, err, "Failed to update file location"
			}
			moveTargetList[i] = moveTarget{OldLocation: oldLocation, NewLocation: newLocation}
		}
	}
	if len(dirIds) > 0 {
		dirs, err := models.Dirs(
			models.DirWhere.ID.IN(dirIds),
		).All(hs.Ctx, tx)
		if err != nil {
			_ = tx.Rollback()
			return http.StatusNotFound, err, "Failed to find dirs"
		}
		offset := len(fileIds)
		for i, dir := range dirs {
			oldLocation, newLocation := dir.Location+"/"+dir.Name, destination+"/"+dir.Name
			dir.Location = destination
			_, err := dir.Update(hs.Ctx, tx, boil.Infer())
			if err != nil {
				_ = tx.Rollback()
				return http.StatusInternalServerError, err, "Failed to update dir location"
			}
			moveTargetList[i+offset] = moveTarget{OldLocation: oldLocation, NewLocation: newLocation}
		}
	}
	for _, target := range moveTargetList {
		if err = mvFunc(target.OldLocation, target.NewLocation); err != nil {
			_ = tx.Rollback()
			return http.StatusInternalServerError, err, "Failed to move dir"
		}
	}
	if err = tx.Commit(); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to commit DB Transaction"
	}
	return http.StatusOK, nil, "Successfully move dir"
}

func (hs Service) DownloadFile(fileIds []string, downloadFunc func(path, fileName string, files models.FileSlice) error) (int, error, string) {
	if len(fileIds) == 0 {
		return http.StatusBadRequest, fmt.Errorf("FileIds must need"), "FileIds must need"
	}

	if len(fileIds) == 1 {
		fileId := fileIds[0]
		file, err := models.FindFile(hs.Ctx, hs.MyDB, fileId)
		if err != nil {
			return http.StatusNotFound, err, "File not found. fileId: " + fileId
		}
		if err = downloadFunc(file.Location, file.Name, models.FileSlice{}); err != nil {
			return http.StatusInternalServerError, err, "Failed to create zip file"
		}
		return http.StatusOK, nil, "Successfully download file"
	}

	// ファイルが複数存在する時はzipファイルにまとめて返す
	files, err := models.Files(models.FileWhere.ID.IN(fileIds)).All(hs.Ctx, hs.MyDB)
	if err != nil {
		return http.StatusNotFound, err, "Files not found"
	}
	zipName := fmt.Sprintf("orilab-download-%s.zip", time.Now().Format("2006年01月02日15時04分"))
	pathIsEmpty := ""
	if err = downloadFunc(pathIsEmpty, zipName, files); err != nil {
		return http.StatusInternalServerError, err, "Failed to create zip file"
	}
	return http.StatusOK, nil, "Successfully download zip file"
}

func (hs Service) DownloadDir(dirId string, downloadFunc func(path, fileName string, fileList []string) error) (int, error, string) {
	dir, err := models.FindDir(hs.Ctx, hs.MyDB, dirId)
	if err != nil {
		return http.StatusNotFound, err, "Find not dir. dirId: " + dirId
	}
	dirPath := filepath.Join(dir.Location, dir.Name)
	var filePathList []string
	if err = filepath.WalkDir(dirPath, func(path string, info fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		filePathList = append(filePathList, path)
		return nil
	}); err != nil {
		return http.StatusInternalServerError, err, "Failed to create zip file"
	}
	if err = downloadFunc(dir.Location, dir.Name, filePathList); err != nil {
		return http.StatusInternalServerError, err, "Failed to create zip file"
	}
	return http.StatusOK, nil, "Successfully download zip file"
}
