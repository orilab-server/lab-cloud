package files_trash_table

import (
	"backend/db"
	"backend/tools"
	"database/sql"
	"fmt"
	"strings"
)

func DeleteRow(myDB *sql.DB, qp db.DeleteQueryParam) error {
	whereStrs, vals := tools.DivideParam(qp.Where)
	whereStr := strings.Join(whereStrs, "and ")
	query := fmt.Sprintf("delete from %s where %s", "files_trash", whereStr)
	res, err := myDB.Query(query, vals...)
	defer res.Close()
	if err != nil {
		return err
	}

	return nil
}