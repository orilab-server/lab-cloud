package reset_tokens

import (
	"backend/db"
	"database/sql"
	"fmt"
	"strings"
)

func InsertRow(myDB *sql.DB, qp db.InsertQueryParam) (sql.Result, error) {
	into, intoVals := getIntos(qp.Column)
	query := fmt.Sprintf("insert into %s(%s) values(%s)", qp.From, into, intoVals)
	ins, err := myDB.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer ins.Close()
	res, err := ins.Exec(qp.Values...)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func getIntos(column []string) (string, string) {
	colCount := len(column)
	intoVals := make([]string, colCount)
	for i := 0; i < colCount; i++ {
		intoVals[i] = "?"
	}
	return strings.Join(column, ","), strings.Join(intoVals, ",")
}
