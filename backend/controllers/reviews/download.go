package reviews

import (
	"github.com/gin-gonic/gin"
)

func (r ReviewsController) Download(ctx *gin.Context) {
	targetPath := r.ReviewDirPath + "/" + ctx.Query("path") + "/" + ctx.Query("file")
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Disposition", "attachment; filename="+ctx.Query("file"))
	ctx.Header("Content-Type", "application/octet-stream")
	ctx.File(targetPath)
}