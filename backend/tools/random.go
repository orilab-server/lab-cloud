package tools

import "crypto/rand"


func GetRandomStr(length int) (string, error) {
	var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	// 乱数を生成
    b := make([]byte, length)
    if _, err := rand.Read(b); err != nil {
		return "", err
    }

    var result string
    for _, v := range b {
        result += string(letters[int(v)%len(letters)])
    }
	return result, nil
}