package mkrm_service

import (
	"fmt"
	"os"
)

type MkRmRequest struct {
	RequestType string `json:"requestType"`
	DirName     string `json:"dirName"`
	FileName    string `json:"fileName"`
}

func (p MkRmRequest) Run(dir string) error {
	switch p.RequestType {
	case "mkdir":
		{
			return p.mkdir(dir)
		}
	case "rmdir":
		{
			return p.rmdir(dir)
		}
	case "rmfile":
		{
			return p.rmfile(dir)
		}
	}
	return fmt.Errorf("error: %s", "command not found")
}

// create new dir
func (p MkRmRequest) mkdir(dir string) error {
	if err := os.Mkdir(dir+"/"+p.DirName, 0777); err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

// remove dir
func (p MkRmRequest) rmdir(dir string) error {
	if err := os.RemoveAll(dir + "/" + p.DirName); err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

// remove file
func (p MkRmRequest) rmfile(dir string) error {
	if err := os.Remove(dir + "/" + p.FileName); err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}
