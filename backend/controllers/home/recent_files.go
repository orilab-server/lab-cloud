package home

import (
	"backend/models"
	"backend/tools"
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type RecentFileResponse struct {
	ID string `json:"id"`
	UserID int `json:"user_id"`
	FileName string `json:"file_name"`
	Location string `json:"location"`
	Type string `json:"type"`
	CreatedAt string `json:"created_at"`
}

func (h HomeController) GetRecentFiles(ctx *gin.Context) {
	count, _ := strconv.Atoi(ctx.DefaultQuery("count", "5")) // デフォルトでは5件取得
	files, err := models.RecentFiles(qm.Limit(count), qm.OrderBy("created_at desc")).All(context.Background(), h.MyDB)
	if err != nil {
		ctx.JSON(http.StatusAccepted, gin.H{
			"recent_files": nil,
		})
		return
	}
	var responses []RecentFileResponse
	for _, file := range files {
		jst, _ := tools.FixToJstLocale(file.CreatedAt)
		responses = append(responses, RecentFileResponse{ID: file.ID, UserID: file.UserID, Type: file.Type, FileName: file.FileName, Location: file.Location, CreatedAt: jst.Format("2006/01/02 15:04")})
	}
	ctx.JSON(http.StatusAccepted, gin.H{
		"recent_files": responses,
	})
}