package users_table

import (
	"backend/db"
	"database/sql"
	"fmt"
	"strings"
)

func SelectRow(myDB *sql.DB, qp db.SelectQueryParam) (db.Users, error) {
	selectStr := strings.Join(qp.Column, ",")
	strs, vals := divideWhereParam(qp.Where)
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

func divideWhereParam(where map[string]any) ([]string, []any) {
	var strs []string
	var vals []any
	for key, val := range where {
		strs = append(strs, key+" = ? ")
		vals = append(vals, val)
	}
	return strs, vals
}

func getScanCols(data *db.Users, column []string) []any {
	var cols []any
	if strings.Contains(strings.Join(column, ""), "*") || len(column) >= 6 {
		return []any{&data.Id, &data.Name, &data.Email, &data.Password, &data.CreatedAt, &data.UpdatedAt}
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
		case "created_at":
			{
				cols = append(cols, &data.CreatedAt)
				continue
			}
		case "updated_at":
			{
				cols = append(cols, &data.CreatedAt)
				continue
			}
		}
	}
	return cols
}
