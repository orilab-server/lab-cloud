package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func Init() (*sql.DB, error) {
	source := fmt.Sprint("host=db port=5432 user=postgres password=postgres dbname=lab_cloud sslmode=disable")
	db, err := sql.Open("postgres", source)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func main() {
	myDB, err := Init()
	defer func(myDB *sql.DB) {
		err := myDB.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(myDB)
	if err != nil {
		log.Fatal(err)
	}
	SeedUsers(myDB)
	SeedDirs(myDB)
	SeedFiles(myDB)
}
