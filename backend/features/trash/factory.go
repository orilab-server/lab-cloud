package trash

import (
	"backend/db/models"
	"context"
)

func getService(tc Controller) Service {
	return Service{context.Background(), tc.MyDB}
}

func newTrashResponse(trashes models.TrashSlice) TrashObjectsResponse {
	files := make([]FileResponse, 0)
	dirs := make([]DirResponse, 0)
	for _, trash := range trashes {
		if trash.DirID.Valid {
			dir := trash.R.Dir
			var parentId *string
			if dir.ParentID.Valid {
				parentId = &dir.ParentID.String
			} else {
				parentId = nil
			}
			dirs = append(dirs, DirResponse{
				ID:        dir.ID,
				Name:      dir.Name,
				UserName:  dir.R.User.Name,
				ParentId:  parentId,
				CreatedAt: dir.CreatedAt.Format("2006-01-02 15:04"),
			})
		} else if trash.FileID.Valid {
			file := trash.R.File
			files = append(files, FileResponse{
				ID:        file.ID,
				Name:      file.Name,
				Size:      file.Size,
				UserName:  file.R.User.Name,
				DirID:     file.DirID,
				CreatedAt: file.CreatedAt.Format("2006-01-02 15:04"),
			})
		}
	}
	return TrashObjectsResponse{
		Files: files,
		Dirs:  dirs,
	}
}

func newTrashResponseFromFilesAndDirs(files models.FileSlice, dirs models.DirSlice) TrashObjectsResponse {
	fileSlice := make([]FileResponse, len(files))
	for i, file := range files {
		fileSlice[i] = FileResponse{
			ID:        file.ID,
			Name:      file.Name,
			UserName:  file.R.User.Name,
			Size:      file.Size,
			DirID:     file.DirID,
			CreatedAt: file.CreatedAt.Format("2006-01-02 15:04"),
		}
	}
	dirSlice := make([]DirResponse, len(dirs))
	for i, dir := range dirs {
		var parentId *string
		if dir.ParentID.Valid {
			parentId = &dir.ParentID.String
		} else {
			parentId = nil
		}
		dirSlice[i] = DirResponse{
			ID:        dir.ID,
			ParentId:  parentId,
			Name:      dir.Name,
			UserName:  dir.R.User.Name,
			CreatedAt: dir.CreatedAt.Format("2006-01-02 15:04"),
		}
	}
	return TrashObjectsResponse{
		Files: fileSlice,
		Dirs:  dirSlice,
	}
}
