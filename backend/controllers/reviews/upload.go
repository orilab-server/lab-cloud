package reviews

import (
	"backend/models"
	"backend/tools"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/scorredoira/email"
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

func (r ReviewsController) UploadTeacherReviewedFile(ctx *gin.Context) {
	targetDir := ctx.PostForm("targetDir")
	reviewDirPath := r.ReviewDirPath+"/"+targetDir
	if _, err := os.Stat(reviewDirPath); err != nil {
		os.MkdirAll(reviewDirPath, 0777)
	}
	file, err := ctx.FormFile("file")
	reviewedId := ctx.Param("reviewed-id")
	reviewedFiles := models.TeacherReviewedFiles(qm.Where("reviewed_id=?", reviewedId))
	reviewCount, _ := reviewedFiles.Count(r.ModelCtx, r.MyDB)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to upload file",
		})
		return
	}
	extension := file.Filename[strings.LastIndex(file.Filename, "."):]
	countInFileName := file.Filename[0:strings.LastIndex(file.Filename, ".")]+"_"+strconv.FormatInt(reviewCount+1, 10)+extension
	filePath := reviewDirPath+"/"+countInFileName
	err = ctx.SaveUploadedFile(file, filePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to upload file",
		})
		return
	}
	id, _ := uuid.NewUUID()
	teacher_reviewed_file := models.TeacherReviewedFile{
		ID: id.String(),
		ReviewedID: reviewedId,
		FileName: countInFileName,
	}
	teacher_reviewed_file.Insert(r.ModelCtx, r.MyDB, boil.Infer())
	userName := ctx.PostForm("userName")
	userEmail := ctx.PostForm("email")
	message := ctx.PostForm("message")
	m := email.NewMessage("[" + userName + "]" + "卒論添削のご依頼", "" +
	"" + userName + "が <" + file.Filename + "> をアップロードしました" + "\r\n" + "\r\n" +
	"計" + strconv.FormatInt(reviewCount + 1, 10) + "回目のアップロードです" + "\r\n" + "\r\n" +
	"----- " + userName + "からのメッセージ -----" + "\r\n" +
	message + "\r\n" + "\r\n" +
	"==============================" + "\r\n" +
	"\r\n" +
	"")
	err = m.Attach(filePath)
	if err != nil {
		log.Fatal(err)
	}
	err = r.MailInfo.SendWithCc(m, r.MailInfo.Teacher, userEmail)
	if err != nil {
		log.Fatal(err)
	}
}