package reviews

import (
	"backend/models"
	"backend/tools"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (r ReviewsController) UploadController(ctx *gin.Context) {
	reviewedId := ctx.Param("reviewed-id")
	targetDir := ctx.PostForm("targetDir")
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to upload file",
		})
		return
	}
	reviewedFiles := models.ReviewedFiles(qm.Where("reviewed_id=?", reviewedId))
	count, _ := reviewedFiles.Count(r.ModelCtx, r.MyDB)
	extension := file.Filename[strings.LastIndex(file.Filename, "."):]
	countInFileName := file.Filename[0:strings.LastIndex(file.Filename, ".")]+"_"+strconv.FormatInt(count+1, 10)+extension
	ctx.SaveUploadedFile(file, r.ReviewDirPath+"/"+targetDir+"/"+countInFileName)
	id, _ := uuid.NewUUID()
	reviewed_file := models.ReviewedFile{ID: id.String(), ReviewedID: reviewedId, FileName: countInFileName}
	reviewed_file.Insert(r.ModelCtx, r.MyDB, boil.Infer())
	userName := ctx.PostForm("userName")
	reviewDir := ctx.PostForm("reviewDir")
	URL := ctx.PostForm("url")
	tools.LineNotify(r.LineNotifyToken, []byte(""+ "\r\n" +
		userName+"が 「" + reviewDir + "」 に新規ファイルをアップロードしました" + "\r\n" +
		"\r\n" +
		"ファイル名 : " + countInFileName + "\r\n" + "\r\n" +
		"URL : " + URL +
	""))
	ctx.JSON(http.StatusAccepted, gin.H{})
}