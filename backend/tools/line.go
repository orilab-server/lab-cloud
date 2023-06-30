package tools

import (
	"log"
	"net/http"
	"net/url"
	"strings"
)

func LineNotify(token string, msg []byte) {
	Url := "https://notify-api.line.me/api/notify"
	u, err := url.ParseRequestURI(Url)
	if err != nil {
		log.Fatal(err)
	}

	c := &http.Client{}

	form := url.Values{}
	form.Add("message", string(msg))
	body := strings.NewReader(form.Encode())
	req, err := http.NewRequest("POST", u.String(), body)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Authorization", "Bearer "+token)

	_, err = c.Do(req)
	if err != nil {
		log.Fatal(err)
	}
}
