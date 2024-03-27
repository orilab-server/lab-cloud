package main

import (
	"backend/db/models"
	"context"
	"database/sql"
	"fmt"
	"github.com/volatiletech/sqlboiler/boil"
	"log"
)

func SeedFiles(myDB *sql.DB) {
	users, err := models.Users().All(context.Background(), myDB)
	if err != nil {
		log.Fatal(err)
	}
	dirs, err := models.Dirs().All(context.Background(), myDB)
	if err != nil {
		log.Fatal(err)
	}
	dir1 := dirs[0]
	dir2 := dirs[2]
	seedList := []models.File{
		{Name: "file1.txt", Location: dir1.Location + "/" + dir1.Name, Size: 1024, UserID: users[0].ID, DirID: dir1.ID},
		{Name: "file2.jpg", Location: dir1.Location + "/" + dir1.Name, Size: 2048, UserID: users[0].ID, DirID: dir1.ID},
		{Name: "file3.txt", Location: dir2.Location + "/" + dir2.Name, Size: 512, UserID: users[1].ID, DirID: dir2.ID},
	}
	for _, seed := range seedList {
		err := seed.Insert(context.Background(), myDB, boil.Infer())
		if err != nil {
			fmt.Println(err)
		}
	}

}
