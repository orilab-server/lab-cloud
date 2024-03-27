package filesystem

import (
	"mime/multipart"
)

type CommonPathParam struct {
	DirID string `uri:"dirId" binding:"required,uuid"`
}

type ChangeNamePathParam struct {
	ID string `uri:"id" binding:"required,uuid"`
}

type FileDownloadQueryParam struct {
	IDs map[string]string `form:"ids[]"`
}

type CreateDirRequest struct {
	Name string `form:"name" binding:"required"`
}

type ChangeNameRequest struct {
	Type    ObjectType `json:"type"`
	NewName string     `json:"newName" binding:"required"`
}

type MoveDirRequest struct {
	ToDirId string   `json:"toDirId" binding:"required,uuid"`
	FileIDs []string `json:"fileIds" binding:"required"`
	DirIDs  []string `json:"dirIds" binding:"required"`
}

type UploadFilesRequest struct {
	Files []*multipart.FileHeader `form:"files[]" binding:"required"`
}

type UploadDirRequest struct {
	Files   []*multipart.FileHeader `form:"files[]" binding:"required"`
	DirName string                  `form:"dirName" binding:"required"`
}
