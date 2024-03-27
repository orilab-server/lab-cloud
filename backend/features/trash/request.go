package trash

type CommonPathParam struct {
	DirID string `uri:"dirId" binding:"required,uuid"`
}

type RestoreRequest struct {
	TrashIDs []string `json:"trashIds" binding:"required"`
}

type DeleteRequest struct {
	TrashIDs []string `json:"trashIds" binding:"required"`
}

type MoveToTrashRequest struct {
	FileIDs []string `json:"fileIds" binding:"required"`
	DirIDs  []string `json:"dirIds" binding:"required"`
}
