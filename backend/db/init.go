package db

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	"os"

	_ "github.com/lib/pq"
)

func Init() (*sql.DB, error) {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	host, port, user, password, dbName, sslMode := os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"), "disable"
	source := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", host, port, user, password, dbName, sslMode)
	db, err := sql.Open("postgres", source)
	if err != nil {
		return nil, err
	}

	return db, nil
}
