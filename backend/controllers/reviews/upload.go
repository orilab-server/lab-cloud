package reviews

import (
	"backend/models"
	"backend/tools"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/scorredoira/email"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

// reviewファイルの情報
func (r ReviewsController) Upload(ctx *gin.Context) {
	reviewId := ctx.Param("review-id")
	userId, _ := strconv.Atoi(ctx.PostForm("userId"))
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to upload file",
		})
		return
	}
	reviewed, _ := models.Revieweds(qm.Where("review_id=?", reviewId), qm.Where("user_id=?", userId)).One(r.ModelCtx, r.MyDB)
	targetDir := reviewed.ReviewID+"/"+strconv.Itoa(reviewed.UserID)
	extension := filepath.Ext(file.Filename)
	id, _ := uuid.NewUUID()
	if err = ctx.SaveUploadedFile(file, r.ReviewDirPath+"/"+targetDir+"/"+id.String()+extension); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to upload file",
		})
		return
	}
	reviewed_file := models.ReviewedFile{ID: id.String(), ReviewedID: reviewed.ID, FileName: file.Filename}
	reviewed_file.Insert(r.ModelCtx, r.MyDB, boil.Infer())
	user, _ := models.FindUser(r.ModelCtx, r.MyDB, reviewed.UserID)
	reviewDir := ctx.PostForm("reviewDir")
	URL := ctx.PostForm("url")
	tools.LineNotify(r.LineNotifyToken, []byte(""+ "\r\n" +
		user.Name+"が 「" + reviewDir + "」 に新規ファイルをアップロードしました" + "\r\n" +
		"\r\n" +
		"ファイル名 : " + file.Filename + "\r\n" + "\r\n" +
		"URL : " + URL +
	""))

	// アップロードファイルをrecent_filesに登録 & 50件超過の場合は古いものから削除する
	recentFileCount, _ := models.RecentFiles(qm.OrderBy("created_at desc")).Count(r.ModelCtx, r.MyDB)
	if recentFileCount >= 50 {
		delCount := recentFileCount - 49
		delFiles, _ := models.RecentFiles(qm.Limit(int(delCount)), qm.OrderBy("created_at desc")).All(r.ModelCtx, r.MyDB)
		for _, f := range delFiles {
			delFile, _ := models.FindRecentFile(r.ModelCtx,r.MyDB,f.ID)
			delFile.Delete(r.ModelCtx,r.MyDB)
		}
	}
	recentFileIid, _ := uuid.NewUUID()
	recents := models.RecentFile{ID: recentFileIid.String(),UserID: userId,Location: reviewId+"?review_name="+reviewDir,FileName: file.Filename,Type: "review"}
	err = recents.Insert(r.ModelCtx, r.MyDB, boil.Infer())
	fmt.Println(err)

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