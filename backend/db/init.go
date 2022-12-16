package db

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Users = struct {
	Id          string
	Name        string
	Password    string
	Email       string
	IsTemporary bool
	CreatedAt   string
	UpdatedAt   string
}

type FilesTrash = struct {
	Id     		   		string
	UserId       		string
	Type         		string
	CurrentLocation string
  PastLocation 		string
	CreatedAt    		string
}

type ResetTokens = struct {
	Id    string
	Email string
	Token string
}

type SelectQueryParam struct {
	From   string
	Column []string
	Where  map[string]any
}

type InsertQueryParam struct {
	From   string
	Column []string
	Values []any
}

type UpdateQueryParam struct {
	From  string
	Set   map[string]any
	Where map[string]any
}

type DeleteQueryParam struct {
	From  string
	Where map[string]any
}

func Init() (*sql.DB, error) {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	source := fmt.Sprintf("%s:%s@(%s:%s)/%s?parseTime=true", os.Getenv("USER_NAME"), os.Getenv("DB_PASS"), os.Getenv("DB_IP"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"))
	db, err := sql.Open("mysql", source)
	if err != nil {
		return nil, err
	}

	return db, nil
}
