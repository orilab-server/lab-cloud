package auth

import (
	"backend/db/models"
	"backend/tools"
	"encoding/json"
	"github.com/volatiletech/sqlboiler/boil"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strconv"
)

func (as Service) Login(body LoginRequest, setSession func(loginUser []byte) error) (int, error, string) {
	user, err := models.Users(models.UserWhere.Email.EQ(body.Email)).One(as.ctxBack, as.MyDB)
	if err != nil {
		return http.StatusNotFound, err, "User not found"
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		return http.StatusBadRequest, err, "Wrong Password"
	} else {
		loginUser, err := json.Marshal(user)
		if err == nil {
			if err = setSession(loginUser); err != nil {
				return http.StatusInternalServerError, err, "Failed to save session"
			}
			return http.StatusOK, nil, "Successfully logged in"
		} else {
			return http.StatusInternalServerError, err, "Something went wrong by Server Error"
		}
	}
}

func (as Service) RequestRegister(body RegisterRequest) (int, error, string) {
	request := models.RegisterRequest{
		Name:  body.Name,
		Email: body.Email,
		Grade: body.Grade,
	}
	if err := request.Insert(as.ctxBack, as.MyDB, boil.Infer()); err != nil {
		return http.StatusInternalServerError, err, "Failed to register user"
	}
	return http.StatusOK, nil, "Successfully register user"
}

func (as Service) FindRegisterRequests() (models.RegisterRequestSlice, error) {
	return models.RegisterRequests().All(as.ctxBack, as.MyDB)
}

func (as Service) AcceptRegisterRequests(body AcceptRegisterRequest) (int, error, string) {
	tx, err := as.MyDB.BeginTx(as.ctxBack, nil)
	if err != nil {
		return http.StatusInternalServerError, err, "Failed to start DB Transaction"
	}
	requests, err := models.RegisterRequests(models.RegisterRequestWhere.ID.IN(body.IDs)).All(as.ctxBack, tx)
	if err != nil {
		_ = tx.Rollback()
		return http.StatusBadRequest, err, "User not found"
	}
	for _, request := range requests {
		randStr, err := tools.GetRandomStr(10)
		if err != nil {
			return http.StatusInternalServerError, err, "Failed to generate random string"
		}
		tempPassword := []byte(randStr)
		hashed, err := bcrypt.GenerateFromPassword(tempPassword, 10)
		if err != nil {
			return http.StatusInternalServerError, err, "Failed to hash password"
		}
		user := models.User{
			Name:        request.Name,
			Password:    string(hashed),
			Email:       request.Email,
			Grade:       request.Grade,
			IsTemporary: true,
		}
		if err := user.Insert(as.ctxBack, tx, boil.Infer()); err != nil {
			_ = tx.Rollback()
			return http.StatusInternalServerError, err, "Failed to DB Transaction"
		}
		if _, err = request.Delete(as.ctxBack, tx); err != nil {
			_ = tx.Rollback()
			return http.StatusInternalServerError, err, "Failed to DB Transaction"
		}
		// TODO: メール送信失敗時のリトライ or fallbackを用意
		if err := as.SendMailOnTempRegister(request.Name, request.Email, randStr, request.Grade); err != nil {
			return http.StatusInternalServerError, err, "Failed to send mail"
		}
	}
	if err = tx.Commit(); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to commit DB Transaction"
	}
	return 0, nil, "Successfully register"
}

func (as Service) SendMailOnTempRegister(name, email, tempPassword string, grade int) error {
	msg := "" +
		"\r\n" +
		"仮登録が完了しました" +
		"\r\n" +
		"============================" +
		"\r\n" +
		"\r\n" +
		"氏名 : " + name + "\r\n" +
		"メールアドレス : " + email + "\r\n" +
		"入学年度 : " + strconv.Itoa(grade) + "\r\n" +
		"\r\n" +
		"こちらの仮パスワードからログインして, 新しくパスワードを設定してください" + "\r\n" +
		"\r\n" +
		"仮パスワード : " + tempPassword +
		"\r\n" +
		"\r\n" +
		"リンク : " + as.SiteUrl +
		"\r\n" +
		""
	return as.MailInfo.SendMail("[仮登録完了のお知らせ]", msg, email, []string{})
}
