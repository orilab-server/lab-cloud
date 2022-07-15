package tools

import "reflect"

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
