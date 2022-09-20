package files_trash_table

import (
	"backend/db"
	"backend/tools"
	"database/sql"
	"fmt"
	"strings"
)

func DeleteRow(myDB *sql.DB, qp db.DeleteQueryParam) (sql.Result, error) {
	whereStrs, _ := tools.DivideParam(qp.Where)
	whereStr := strings.Join(whereStrs, "and ")
	query := fmt.Sprintf("delete from %s where %s", "files_trash", whereStr)
	del, err := myDB.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer del.Close()
	res, err := del.Exec()
	if err != nil {
		return nil, err
	}

	return res, nil
}