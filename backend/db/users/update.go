package users_table

import (
	"backend/db"
	"backend/tools"
	"database/sql"
	"fmt"
	"strings"
)

func UpdateRow(myDB *sql.DB, qp db.UpdateQueryParam) (sql.Result, error) {
	setStrs, setVals := tools.DivideParam(qp.Set)
	whereStrs, whereVals := tools.DivideParam(qp.Where)
	updateStr := strings.Join(setStrs, ",")
	whereStr := strings.Join(whereStrs, "and ")
	query := fmt.Sprintf("update %s set %s where %s", qp.From, updateStr, whereStr)
	upd, err := myDB.Prepare(query)
	if err != nil {
		return nil, err
	}
	setVals = append(setVals, whereVals...)
	res, err := upd.Exec(setVals...)
	if err != nil {
		return nil, err
	}
	return res, nil
}
