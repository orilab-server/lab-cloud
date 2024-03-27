package main

import (
	"backend/db/models"
	"context"
	"database/sql"
	"github.com/volatiletech/null"
	"github.com/volatiletech/sqlboiler/boil"
	"log"
)

func SeedDirs(myDB *sql.DB) {
	tx, err := myDB.BeginTx(context.Background(), nil)
	users, err := models.Users().All(context.Background(), tx)
	if err != nil {
		_ = tx.Rollback()
		log.Fatal(err)
	}
	seedList := []models.Dir{
		{Name: "dir1", Location: "/path/to", UserID: users[0].ID},
		{Name: "dir2", Location: "/path/to", UserID: users[0].ID},
		{Name: "dir3", Location: "/path/to", UserID: users[1].ID},
	}
	for _, seed := range seedList {
		err := seed.Insert(context.Background(), tx, boil.Infer())
		if err != nil {
			_ = tx.Rollback()
			log.Fatal(err)
		}
	}
	dirs, err := models.Dirs().All(context.Background(), tx)
	if err != nil {
		_ = tx.Rollback()
		log.Fatal(err)
	}
	parentID1 := null.NewString(dirs[0].ID, true)
	parentID2 := null.NewString(dirs[2].ID, true)
	seedList = []models.Dir{
		{ParentID: parentID1, Name: "dir4", Location: dirs[0].Location + "/" + dirs[0].Name, UserID: users[0].ID},
		{ParentID: parentID1, Name: "dir5", Location: dirs[0].Location + "/" + dirs[0].Name, UserID: users[0].ID},
		{ParentID: parentID2, Name: "dir6", Location: dirs[2].Location + "/" + dirs[2].Name, UserID: users[1].ID},
	}
	for _, seed := range seedList {
		err := seed.Insert(context.Background(), tx, boil.Infer())
		if err != nil {
			_ = tx.Rollback()
			log.Fatal(err)
		}
	}
	_ = tx.Commit()
}
