package db

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Users = struct {
	Id        string
	Name      string
	Password  string
	Email     string
	CreatedAt string
	UpdatedAt string
}

type SelectQueryParam struct {
	From   string
	Column []string
	Where  map[string]any
}

type InsertQueryParam struct {
	From string
	Column []string
	Values []any
}

func Init() (*sql.DB, error) {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	source := fmt.Sprintf("%s:%s@(%s:%s)/%s", os.Getenv("USER_NAME"), os.Getenv("DB_PASS"), os.Getenv("HOST_IP"), os.Getenv("HOST_PORT"), os.Getenv("DB_NAME"))
	db, err := sql.Open("mysql", source)
	if err != nil {
		return nil, err
	}

	return db, nil
}
