package files_trash_table

import (
	"backend/db"
	"backend/tools"
	"database/sql"
	"fmt"
	"strings"
)

func SelectRow(myDB *sql.DB, qp db.SelectQueryParam) (db.FilesTrash, error) {
	selectStr := strings.Join(qp.Column, ",")
	strs, vals := tools.DivideParam(qp.Where)
	whereStr := strings.Join(strs, "and ")
	query := fmt.Sprintf("select %s from %s", selectStr, qp.From)
	if whereStr != "" {
		query = fmt.Sprintf("%s where %s", query, whereStr)
	}
	var data db.FilesTrash
	scanCols := getScanCols(&data, qp.Column)
	err := myDB.QueryRow(query, vals...).Scan(scanCols...)
	if err != nil {
		return db.FilesTrash{}, nil
	}
	return data, nil
}

func SelectRows(myDB *sql.DB, qp db.SelectQueryParam) ([]db.FilesTrash, error) {
	selectStr := strings.Join(qp.Column, ",")
	strs, vals := tools.DivideParam(qp.Where)
	whereStr := strings.Join(strs, "and ")
	query := fmt.Sprintf("select %s from %s", selectStr, qp.From)
	if whereStr != "" {
		query = fmt.Sprintf("%s where %s", query, whereStr)
	}
	rows, err := myDB.Query(query, vals...)
	if err != nil {
		return []db.FilesTrash{}, err
	}
	var results []db.FilesTrash
	for rows.Next() {
		f := &db.FilesTrash{}
		if err := rows.Scan(getScanCols(f, qp.Column)...); err != nil {
			fmt.Printf("getRows rows.Scan error err:%v", err)
			continue
		}
		results = append(results, *f)
	}
	return results, nil
}

func getScanCols(data *db.FilesTrash, column []string) []any {
	var cols []any
	if strings.Contains(strings.Join(column, ""), "*") || len(column) >= 7 {
		return []any{&data.Id, &data.UserId, &data.Type, &data.CurrentLocation, &data.PastLocation, &data.CreatedAt}
	}
	for _, str := range column {
		switch str {
		case "id":
			{
				cols = append(cols, &data.Id)
				continue
			}
		case "user_id":
			{
				cols = append(cols, &data.UserId)
				continue
			}
		case "type":
			{
				cols = append(cols, &data.Type)
				continue
			}
		case "current_location":
			{
				cols = append(cols, &data.CurrentLocation)
				continue
			}
		case "past_location":
			{
				cols = append(cols, &data.PastLocation)
				continue
			}
		case "created_at":
			{
				cols = append(cols, &data.CreatedAt)
				continue
			}
		}
	}
	return cols
}
