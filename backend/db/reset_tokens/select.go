package reset_tokens

import (
	"backend/db"
	"backend/tools"
	"database/sql"
	"fmt"
	"strings"
)

func SelectRow(myDB *sql.DB, qp db.SelectQueryParam) (db.ResetTokens, error) {
	selectStr := strings.Join(qp.Column, ",")
	strs, vals := tools.DivideParam(qp.Where)
	whereStr := strings.Join(strs, "and ")
	query := fmt.Sprintf("select %s from %s", selectStr, qp.From)
	if whereStr != "" {
		query = fmt.Sprintf("%s where %s", query, whereStr)
	}
	var data db.ResetTokens
	scanCols := getScanCols(&data, qp.Column)
	err := myDB.QueryRow(query, vals...).Scan(scanCols...)
	if err != nil {
		return db.ResetTokens{}, nil
	}
	return data, nil
}

func getScanCols(data *db.ResetTokens, column []string) []any {
	var cols []any
	if strings.Contains(strings.Join(column, ""), "*") || len(column) >= 7 {
		return []any{&data.Id, &data.Email, &data.Token}
	}
	for _, str := range column {
		switch str {
		case "id":
			{
				cols = append(cols, &data.Id)
				continue
			}
		case "email":
			{
				cols = append(cols, &data.Email)
				continue
			}
		case "token":
			{
				cols = append(cols, &data.Token)
				continue
			}
		}
	}
	return cols
}