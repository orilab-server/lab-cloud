package filesystem

import (
	"backend/db/models"
	"context"
)

func getService(fc Controller) Service {
	return Service{fc.ShareDir, fc.MyDB, context.Background()}
}

func newFileResponseSlice(files models.FileSlice) []FileResponse {
	slice := make([]FileResponse, len(files))
	for i, file := range files {
		slice[i] = FileResponse{
			ID:        file.ID,
			Name:      file.Name,
			UserName:  file.R.User.Name,
			Size:      file.Size,
			DirID:     file.DirID,
			CreatedAt: file.CreatedAt.Format("2006-01-02 15:04"),
		}
	}
	return slice
}

func newDirResponseSlice(dirs models.DirSlice) []DirResponse {
	slice := make([]DirResponse, len(dirs))
	for i, dir := range dirs {
		var parentId *string
		if dir.ParentID.Valid {
			parentId = &dir.ParentID.String
		} else {
			parentId = nil
		}
		slice[i] = DirResponse{
			ID:        dir.ID,
			ParentId:  parentId,
			Name:      dir.Name,
			UserName:  dir.R.User.Name,
			CreatedAt: dir.CreatedAt.Format("2006-01-02 15:04"),
		}
	}
	return slice
}
