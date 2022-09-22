package command_service

import (
	"fmt"
	"os"
)

func Mkdir(path string) error {
	if err := os.Mkdir(path, 0777); err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}
