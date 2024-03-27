package main

import (
	"backend/db/models"
	"context"
	"database/sql"
	"fmt"
	"github.com/volatiletech/sqlboiler/boil"
)

func SeedUsers(myDB *sql.DB) {
	seedList := []models.User{
		{Name: "user1", Email: "user1@example.com", Password: "password1", Grade: 2023},
		{Name: "user2", Email: "user2@example.com", Password: "password2", Grade: 2022},
		{Name: "user3", Email: "user3@example.com", Password: "password3", Grade: 2021},
	}
	for _, seed := range seedList {
		err := seed.Insert(context.Background(), myDB, boil.Infer())
		if err != nil {
			fmt.Println(err)
		}
	}
}
