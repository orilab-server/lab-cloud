package tools

import (
	"backend/db/models"
	"encoding/json"
	"github.com/gin-contrib/sessions"
	"github.com/koron/go-dproxy"
)

func GetLoginUser(session sessions.Session, sessionKey string) (models.User, error) {
	var loginUser models.User
	jsonLoginUser, err := dproxy.New(session.Get(sessionKey)).String()
	if err != nil {
		return loginUser, err
	}
	if err := json.Unmarshal([]byte(jsonLoginUser), &loginUser); err != nil {
		return loginUser, err
	}
	return loginUser, nil
}
