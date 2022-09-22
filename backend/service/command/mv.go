package command_service

import (
	"fmt"
	"os"
)

func Mv(old string, new string) error {
	if err := os.Rename(old, new); err != nil {
		fmt.Println(err)
		return err
	}
	return fmt.Errorf("error: %s", "command not found")
}