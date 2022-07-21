package tools

import (
	"io/ioutil"
)

func GetDirs(dir string) ([]string, error) {
	findList := []string{}

	items, err := ioutil.ReadDir(dir)

	if err != nil {
		return nil, err
	}

	for _, item := range items {
		if (item.IsDir()) {
			findList = append(findList, dir+"/"+item.Name())
		}
	}

	return findList, err
}