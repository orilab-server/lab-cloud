package user

import (
	"backend/db/models"
	"fmt"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries/qm"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func (us UserService) FindAllUsers() (models.UserSlice, error) {
	return models.Users(qm.Select("id", "name", "email", "grade", "is_temporary")).All(us.CxtBack, us.MyDB)
}

func (us UserService) FindUserByEmail(email string) (*models.User, error) {
	return models.Users(models.UserWhere.Email.EQ(email)).One(us.CxtBack, us.MyDB)
}

func (us UserService) UpdatePassword(email, newPassword string) (int, error, string) {
	tx, err := us.MyDB.BeginTx(us.CxtBack, nil)
	if err != nil {
		return http.StatusInternalServerError, err, "Failed to start DB Transaction"
	}
	user, err := models.Users(qm.Where("email=?", email)).One(us.CxtBack, tx)
	if err != nil {
		_ = tx.Rollback()
		return http.StatusNotFound, err, "User not found. email: " + email
	}
	user.Password = newPassword
	user.IsTemporary = false
	if _, err := user.Update(us.CxtBack, tx, boil.Infer()); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to DB Transaction"
	}
	_ = tx.Commit()
	return 0, nil, ""
}

func (us UserService) UpdateName(email, newName string) error {
	_, err := models.Users(qm.Where("email=?", email)).UpdateAll(us.CxtBack, us.MyDB, models.M{"name": newName})
	return err
}

func (us UserService) CreatePassword(email, token string) (int, error, string) {
	tx, err := us.MyDB.BeginTx(us.CxtBack, nil)
	userExist, err := models.Users(qm.Where("email=?", email)).Exists(us.CxtBack, tx)
	if !userExist || err != nil {
		_ = tx.Rollback()
		if err == nil {
			err = fmt.Errorf("failed to find user by email: %s", email)
		}
		return http.StatusNotFound, err, "User not found"
	}
	resetToken := models.ResetToken{
		Email: email,
		Token: token,
	}
	if err := resetToken.Insert(us.CxtBack, us.MyDB, boil.Infer()); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to DB Transaction"
	}
	_ = tx.Commit()
	return http.StatusOK, nil, ""
}

func (us UserService) UpdatePasswordByResetToken(token, newPassword string) (int, error, string) {
	tx, err := us.MyDB.BeginTx(us.CxtBack, nil)
	tokens, err := models.ResetTokens(qm.Where("token=?", token)).One(us.CxtBack, tx)
	if err != nil {
		_ = tx.Rollback()
		return http.StatusNotFound, err, "Token not found"
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), 10)
	if err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to hash password"
	}
	if _, err := models.Users(qm.Where("email=?", tokens.Email)).UpdateAll(us.CxtBack, tx, models.M{"password": string(hashed)}); err != nil {
		_ = tx.Rollback()
		return http.StatusBadRequest, err, "Failed to DB Transaction"
	}
	// 使用済みトークンは削除
	if _, err = models.ResetTokens(qm.Where("id=?", tokens.ID)).DeleteAll(us.CxtBack, tx); err != nil {
		_ = tx.Rollback()
		return http.StatusInternalServerError, err, "Failed to DB Transaction"
	}
	_ = tx.Commit()
	return http.StatusOK, nil, "Successfully reset password"
}
