package filesystem

type FileResponse struct {
	ID        string `json:"id" binding:"required"`
	Name      string `json:"name" binding:"required"`
	UserName  string `json:"userName" binding:"required"`
	Size      int64  `json:"size" binding:"required"`
	DirID     string `json:"dirId" binding:"required"`
	CreatedAt string `json:"createdAt" binding:"required"`
}

type DirResponse struct {
	ID        string  `json:"id" binding:"required"`
	ParentId  *string `json:"parentId"`
	Name      string  `json:"name" binding:"required"`
	UserName  string  `json:"userName" binding:"required"`
	CreatedAt string  `json:"createdAt" binding:"required"`
}

type FileSystemObjectsResponse struct {
	Files []FileResponse `json:"files" binding:"required"`
	Dirs  []DirResponse  `json:"dirs" binding:"required"`
}
