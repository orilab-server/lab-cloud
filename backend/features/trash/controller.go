package trash

import (
	"backend/httpUtils"
	"github.com/gin-gonic/gin"
	"net/http"
)

// GetTrashes
// @Description Get trash objects
// @Tags Trash
// @Accept json
// @Produce json
// @Success 200 {object} trash.TrashObjectsResponse
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /trashes [get]
func (tc Controller) GetTrashes(ctx *gin.Context) {
	service := getService(tc)
	trashes, err := service.FindTrashObjects()
	if err != nil {
		httpUtils.MessageResponse(ctx, http.StatusInternalServerError, "Failed to find trash objects")
		return
	}
	ctx.JSON(http.StatusOK, trashes)
}

// MoveToTrash
// @Description Delete objects from trashes
// @Tags Trash
// @Accept json
// @Produce json
// @Param requestBody body trash.MoveToTrashRequest true "Request body"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /trashes [post]
func (tc Controller) MoveToTrash(ctx *gin.Context) {
	var body MoveToTrashRequest
	if err := ctx.ShouldBindJSON(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	service := getService(tc)
	status, err, msg := service.MoveToTrash(body)
	if err != nil {
		//	TODO: ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// DeleteObjects
// @Description Delete objects from trashes
// @Tags Trash
// @Accept json
// @Produce json
// @Param requestBody body trash.DeleteRequest true "Request body"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /trashes [delete]
func (tc Controller) DeleteObjects(ctx *gin.Context) {
	var body DeleteRequest
	if err := ctx.ShouldBindJSON(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	service := getService(tc)
	status, err, msg := service.DeleteFromTrash(body)
	if err != nil {
		//	TODO: ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}

// GetTrashesInDir
// @Description Get files in dir of trash objects(dir)
// @Tags Trash
// @Accept json
// @Produce json
// @Param dirId path int true "Dir ID"
// @Success 200 {object} trash.TrashObjectsResponse
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /trashes/{dirId} [get]
func (tc Controller) GetTrashesInDir(ctx *gin.Context) {
	var params CommonPathParam
	if err := ctx.ShouldBindUri(&params); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid path param")
		return
	}
	service := getService(tc)
	trashes, err := service.FindTrashObjectsInDir(params.DirID)
	if err != nil {
		httpUtils.MessageResponse(ctx, http.StatusInternalServerError, "Failed to find trash objects")
		return
	}
	ctx.JSON(http.StatusOK, trashes)
}

// RestoreObjects
// @Description Restore objects from trashes
// @Tags Trash
// @Accept json
// @Produce json
// @Param requestBody body trash.RestoreRequest true "Request body"
// @Success 200 {object} httpUtils.MessageResponseType
// @failure 400 {object} httpUtils.MessageResponseType
// @failure 500 {object} httpUtils.MessageResponseType
// @Router /trashes/restore [post]
func (tc Controller) RestoreObjects(ctx *gin.Context) {
	var body RestoreRequest
	if err := ctx.ShouldBindJSON(&body); err != nil {
		httpUtils.MessageResponse(ctx, http.StatusBadRequest, "Invalid request body")
		return
	}
	service := getService(tc)
	status, err, msg := service.RestoreFromTrash(body)
	if err != nil {
		//	ログ実装
	}
	httpUtils.MessageResponse(ctx, status, msg)
}
