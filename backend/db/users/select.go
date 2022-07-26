package users_table

import (
	"backend/db"
	"backend/tools"
	"database/sql"
	"fmt"
	"strings"
)

func SelectRow(myDB *sql.DB, qp db.SelectQueryParam) (db.Users, error) {
	selectStr := strings.Join(qp.Column, ",")
	strs, vals := tools.DivideParam(qp.Where)
	whereStr := strings.Join(strs, "and ")
	query := fmt.Sprintf("select %s from %s where %s", selectStr, qp.From, whereStr)
	var data db.Users
	scanCols := getScanCols(&data, qp.Column)
	err := myDB.QueryRow(query, vals...).Scan(scanCols...)
	if err != nil {
		return db.Users{}, nil
	}
	return data, nil
}

func getScanCols(data *db.Users, column []string) []any {
	var cols []any
	if strings.Contains(strings.Join(column, ""), "*") || len(column) >= 7 {
		return []any{&data.Id, &data.Name, &data.Email, &data.Password, &data.IsTemporary, &data.CreatedAt, &data.UpdatedAt}
	}
	for _, str := range column {
		switch str {
		case "id":
			{
				cols = append(cols, &data.Id)
				continue
			}
		case "name":
			{
				cols = append(cols, &data.Name)
				continue
			}
		case "password":
			{
				cols = append(cols, &data.Password)
				continue
			}
		case "email":
			{
				cols = append(cols, &data.Email)
				continue
			}
		case "is_temporary":
			{
				cols = append(cols, &data.IsTemporary)
				continue
			}
		case "created_at":
			{
				cols = append(cols, &data.CreatedAt)
				continue
			}
		case "updated_at":
			{
				cols = append(cols, &data.UpdatedAt)
				continue
			}
		}
	}
	return cols
}
