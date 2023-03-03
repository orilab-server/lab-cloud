package tools

import (
	"io/fs"
	"os"
	"path/filepath"
)

type StorageItem struct {
	Name  string `json:"name"`
	Size  int64  `json:"size"`
	Type 	string `json:"type"`
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

func GetDirs(dir string) ([]string, error) {
	findList := []string{}

	items, err := os.ReadDir(dir)

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
func GetDirAndFileNames(dir string) ([]StorageItem, error) {
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var items []StorageItem
	for _, file := range files {
		size, err := GetFileSize(dir+"/"+file.Name())
		if err != nil {
			size = 0
		}
		if file.IsDir() {
			items = append(items, StorageItem{Name: file.Name(), Size: size, Type: "dir"})
			continue
		}
		items = append(items, StorageItem{Name: file.Name(), Size: size, Type: "file"})
	}

	return items, nil
}
