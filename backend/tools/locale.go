package tools

import "time"

func FixToJstLocale(t time.Time) (time.Time, error) {
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		return t, err
	}
	return t.In(jst), nil
}
