package tools

import (
	"reflect"
)

// check a elelemt is in a list, and return index
func Contains(list interface{}, elm interface{}) (bool, int) {
	listV := reflect.ValueOf(list)

	if listV.Kind() == reflect.Slice {
		for index := 0; index < listV.Len(); index++ {
			item := listV.Index(index).Interface()
			if !reflect.TypeOf(elm).ConvertibleTo(reflect.TypeOf(item)) {
				continue
			}
			target := reflect.ValueOf(elm).Convert(reflect.TypeOf(item)).Interface()
			if ok := reflect.DeepEqual(item, target); ok {
				return true, index
			}
		}
	}
	return false, -1
}

// 
func Filter[T comparable](slice []T, elm T) []T {
	var ret []T
	for _, v := range slice {
			if v == elm {
				continue
			}
			ret = append(ret, v)
	}
	return ret
}