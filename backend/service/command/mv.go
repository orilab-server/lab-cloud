package command_service

import (
	"fmt"
	"os"
)

func Mv(old, new string) error {
	if err := os.Rename(old, new); err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}