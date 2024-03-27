package filesystem

import (
	"encoding/json"
	"fmt"
)

const (
	FILE ObjectType = iota
	DIR
)

func (o *ObjectType) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return fmt.Errorf("data should be a string, got %s", b)
	}
	var ot ObjectType
	switch s {
	case "0":
		ot = FILE
	case "1":
		ot = DIR
	default:
		return fmt.Errorf("invalid ObjectType %s", s)
	}
	*o = ot
	return nil
}
