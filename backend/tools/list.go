package tools

import (
	"os"
	"path/filepath"
	"reflect"
)

type StorageItem struct {
	Path string `json:"path"`
	Type string `json:"type"`
}

func Contains(list interface{}, elm interface{}) bool {
	listV := reflect.ValueOf(list)

	if listV.Kind() == reflect.Slice {
		for index := 0; index < listV.Len(); index++ {
			item := listV.Index(index).Interface()
			if !reflect.TypeOf(elm).ConvertibleTo(reflect.TypeOf(item)) {
				continue
			}
			target := reflect.ValueOf(elm).Convert(reflect.TypeOf(item)).Interface()
			if ok := reflect.DeepEqual(item, target); ok {
				return true
			}
		}
	}
	return false
}

// return dir and file of paths and types
func Getitems(dir string) ([]StorageItem, error) {
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var items []StorageItem
	for _, file := range files {
		if file.IsDir() {
			items = append(items, StorageItem{Path: filepath.Join(dir, file.Name()), Type: "dir"})
			continue
		}
		items = append(items, StorageItem{Path: filepath.Join(dir, file.Name()), Type: "file"})
	}

	return items, nil
}
