package filesystem

import (
	"archive/zip"
	"backend/db/models"
	"backend/httpUtils"
	"backend/tools"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/volatiletech/null"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// GetFileSystemObjects
// @Description Get file system objects
// @Tags Filesystem
// @Accept json
// @Produce json
// @Param dirId path int true "Dir ID"
// @Success 200 {object} filesystem.FileSystemObjectsResponse
// @failure 404 {object} httpUtils.MessageResponseType
// @Router /filesystem/{dirId} [get]
func (fc Controller) GetFileSystemObjects(ctx *gin.Context) {
	var params CommonPathParam
	if err := ctx.ShouldBindUri(&params); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusNotFound, "Invalid path param")
		return
	}
	dirId := params.DirID
	service := getService(fc)
	objects, err, msg := service.FindFileSystemObjects(dirId)
	if err != nil {
		httpUtils.MessageResponse(ctx, http.StatusNotFound, msg)
		return
	}
	ctx.JSON(http.StatusOK, objects)
}

// CreateDir
// @Description Create new Dir
// @Tags Filesystem
// @Accept json
// @Produce json
// @Param dirId path int true "Dir ID"
// @Param requestBody body filesystem.CreateDirRequest true "Request body"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 404 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /filesystem/{dirId} [post]
func (fc Controller) CreateDir(ctx *gin.Context) {
	var params CommonPathParam
	if err := ctx.ShouldBindUri(&params); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusNotFound, "Invalid path param")
		return
	}
	dirId := params.DirID
	body := CreateDirRequest{}
	if err := ctx.ShouldBind(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	session := sessions.Default(ctx)
	loginUser, err := tools.GetLoginUser(session, fc.SessionKey)
	if err != nil {
		httpUtils.MessageResponse(ctx, http.StatusInternalServerError, "Failed to get login user")
		return
	}
	service := getService(fc)
	mkdirFunc := func(location string) error {
		if err := os.Mkdir(location+"/"+body.Name, 0777); err != nil {
			return err
		}
		return nil
	}
	dirModel := models.Dir{
		UserID:   loginUser.ID,
		Name:     body.Name,
		ParentID: null.NewString(dirId, true),
	}
	status, err, msg := service.CreateDir(&dirModel, mkdirFunc)
	if err != nil {
		//	TODO: ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// ChangeName
// @Description Change dir or file name
// @Tags Filesystem
// @Accept json
// @Produce json
// @Param id path int true "File or Dir ID"
// @Param requestBody body filesystem.ChangeNameRequest true "Request body"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 404 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /filesystem/rename/{id} [put]
func (fc Controller) ChangeName(ctx *gin.Context) {
	var params ChangeNamePathParam
	if err := ctx.ShouldBindUri(&params); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusNotFound, "Invalid path param")
		return
	}
	body := ChangeNameRequest{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	service := getService(fc)
	renameFunc := func(old, new string) error {
		if err := os.Rename(old, new); err != nil {
			return err
		}
		return nil
	}
	status, err, msg := service.ChangeName(params.ID, body, renameFunc)
	if err != nil {
		//	TODO: ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// MoveDir
// @Description Move dir to another dir
// @Tags Filesystem
// @Accept json
// @Produce json
// @Param dirId path int true "Dir ID"
// @Param requestBody body filesystem.MoveDirRequest true "Request body"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /filesystem/{dirId}/location [put]
func (fc Controller) MoveDir(ctx *gin.Context) {
	body := MoveDirRequest{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	service := getService(fc)
	mvFunc := func(old, new string) error {
		if err := os.Rename(old, new); err != nil {
			return err
		}
		return nil
	}
	status, err, msg := service.MoveDir(body, mvFunc)
	if err != nil {
		//	TODO: ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// UploadFiles
// @Description Upload files
// @Tags Filesystem
// @Accept json
// @Produce json
// @Param dirId path int true "Dir ID"
// @Param requestBody body filesystem.UploadFilesRequest true "Request body"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 404 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /filesystem/upload/{dirId}/files [post]
func (fc Controller) UploadFiles(ctx *gin.Context) {
	var params CommonPathParam
	if err := ctx.ShouldBindUri(&params); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusNotFound, "Invalid path param")
		return
	}
	dirId := params.DirID
	body := UploadFilesRequest{}
	if err := ctx.ShouldBind(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	session := sessions.Default(ctx)
	loginUser, err := tools.GetLoginUser(session, fc.SessionKey)
	if err != nil {
		httpUtils.MessageResponse(ctx, http.StatusInternalServerError, "Failed to get login user")
		return
	}
	fileModels := make([]models.File, len(body.Files))
	for i, file := range body.Files {
		fileModels[i] = models.File{
			UserID: loginUser.ID,
			DirID:  dirId,
			Name:   file.Filename,
			Size:   file.Size,
		}
	}
	service := getService(fc)
	uploadFunc := func(destination string) error {
		for _, file := range body.Files {
			err := ctx.SaveUploadedFile(file, destination+"/"+file.Filename)
			if err != nil {
				return err
			}
		}
		return nil
	}
	status, err, msg := service.CreateFiles(dirId, fileModels, uploadFunc)
	if err != nil {
		//	TODO: ログ実装
		return
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// UploadDir
// @Description Upload dir
// @Tags Filesystem
// @Accept json
// @Produce json
// @Param dirId path int true "Dir ID"
// @Param requestBody body filesystem.UploadDirRequest true "Request body"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 404 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /filesystem/upload/{dirId}/dir [post]
func (fc Controller) UploadDir(ctx *gin.Context) {
	dirId := ctx.Param("dirId")
	body := UploadDirRequest{}
	if err := ctx.ShouldBind(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	session := sessions.Default(ctx)
	loginUser, err := tools.GetLoginUser(session, fc.SessionKey)
	if err != nil {
		httpUtils.MessageResponse(ctx, http.StatusInternalServerError, "Failed to get login user")
		return
	}
	fileModels := make([]models.File, len(body.Files))
	for i, file := range body.Files {
		fileModels[i] = models.File{
			UserID: loginUser.ID,
			DirID:  dirId,
			Name:   file.Filename,
			Size:   file.Size,
		}
	}
	dirModel := models.Dir{
		UserID:   loginUser.ID,
		Name:     body.DirName,
		ParentID: null.NewString(dirId, true),
	}
	service := getService(fc)
	uploadFunc := func(destination string) error {
		dirPath := destination + "/" + body.DirName
		if err := os.MkdirAll(dirPath, 0777); err != nil {
			return err
		}
		for _, file := range body.Files {
			err := ctx.SaveUploadedFile(file, dirPath+"/"+file.Filename)
			if err != nil {
				return err
			}
		}
		return nil
	}
	status, err, msg := service.CreateDirAndFiles(dirId, dirModel, fileModels, uploadFunc)
	if err != nil {
		//	TODO: ログ実装
		return
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// DownloadFile
// @Description Download file or zip file if request to download multiple files
// @Tags Filesystem
// @Accept json
// @Produce json
// @Param fileIds query string true "File IDs"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 404 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /filesystem/download/files [get]
func (fc Controller) DownloadFile(ctx *gin.Context) {
	idMap := ctx.QueryMap("fileIds")
	fileIds := make([]string, 0, len(idMap))
	for _, id := range idMap {
		fileIds = append(fileIds, id)
	}
	service := getService(fc)
	downloadFunc := func(path, fileName string, files models.FileSlice) error {
		ctx.Writer.Header().Set("Content-Description", "File Transfer")
		ctx.Writer.Header().Set("Content-Transfer-Encoding", "binary")
		ctx.Writer.Header().Set("Content-Disposition", "attachment; filename="+fileName)
		if len(files) > 1 {
			ctx.Writer.Header().Set("Content-Type", "application/zip")
			zipWriter := zip.NewWriter(ctx.Writer)
			defer zipWriter.Close()
			for _, file := range files {
				f, err := os.Open(filepath.Join(file.Location, file.Name))
				if err != nil {
					return err
				}
				w, err := zipWriter.Create(file.Name)
				if err != nil {
					return err
				}
				if _, err = io.Copy(w, f); err != nil {
					return err
				}
			}
		} else {
			ctx.Writer.Header().Set("Content-Type", "application/octet-stream")
			ctx.File(filepath.Join(path, fileName))
		}
		return nil
	}
	status, err, msg := service.DownloadFile(fileIds, downloadFunc)
	if err != nil {
		//	TODO: ログ実装
		return
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// DownloadDir
// @Description Download zip file converted from dir
// @Tags Filesystem
// @Accept json
// @Produce json
// @Param dirId path int true "Dir ID"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 404 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /filesystem/download/dirs/{dirId} [get]
func (fc Controller) DownloadDir(ctx *gin.Context) {
	var params CommonPathParam
	if err := ctx.ShouldBindUri(&params); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusNotFound, "Invalid path param")
		return
	}
	dirId := params.DirID
	service := getService(fc)
	downloadFunc := func(path, dirName string, filePathList []string) error {
		zipFileName := fmt.Sprintf("%s-%s.zip", dirName, time.Now().Format("2006年01月02日15時04分"))
		ctx.Writer.Header().Set("Content-Description", "File Transfer")
		ctx.Writer.Header().Set("Content-Transfer-Encoding", "binary")
		ctx.Writer.Header().Set("Content-Disposition", "attachment; filename="+zipFileName)
		ctx.Writer.Header().Set("Content-Type", "application/zip")
		zipWriter := zip.NewWriter(ctx.Writer)
		defer zipWriter.Close()
		for _, filePath := range filePathList {
			f, err := os.Open(filePath)
			if err != nil {
				return err
			}
			w, err := zipWriter.Create(strings.Replace(filePath, path, "", 1))
			if err != nil {
				return err
			}
			if _, err = io.Copy(w, f); err != nil {
				return err
			}
		}
		return nil
	}
	status, err, msg := service.DownloadDir(dirId, downloadFunc)
	if err != nil {
		//	TODO: ログ実装
		return
	}
	httpUtils.MessageResponse(ctx, status, msg)
}
