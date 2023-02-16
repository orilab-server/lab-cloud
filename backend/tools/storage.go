package tools

import (
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
)

type StorageItem struct {
	Path 				 string `json:"path"`
	Type 				 string `json:"type"`
	Id   				 string `json:"id"` 
	PastLocation string `json:"pastLocation"`
}

func GetDirs(dir string) ([]string, error) {
	findList := []string{}

	items, err := ioutil.ReadDir(dir)

	if err != nil {
		return nil, err
	}

	for _, item := range items {
		if item.IsDir() {
			findList = append(findList, dir+"/"+item.Name())
		}
	}

	return findList, err
}

// return dir and file of paths and types
func GetDirAndFilePaths(dir string) ([]StorageItem, error) {
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var items []StorageItem
	for _, file := range files {
		if file.IsDir() {
			items = append(items, StorageItem{Id: "", Path: filepath.Join(dir, file.Name()), Type: "dir", PastLocation: ""})
			continue
		}
		items = append(items, StorageItem{Id: "", Path: filepath.Join(dir, file.Name()), Type: "file", PastLocation: ""})
	}

	return items, nil
}

func GetFileSize(path string) (int64, error) {
	f, err := os.Open(path)
	
	if err != nil {
		f.Close()
		return 0, err
	}
	
	fi, err := f.Stat()
	f.Close()

	var size int64 = 0

	if fi.IsDir() {
		filepath.Walk(path, func(path string, info fs.FileInfo, err error) error {
			if !info.IsDir() {
				size += info.Size()
			}
			return err
		})
		return size, nil
	}

	if err != nil {
		return 0, err
	}
	size = fi.Size()
	return size, nil
}
