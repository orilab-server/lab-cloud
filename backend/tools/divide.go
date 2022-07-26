package tools

func DivideParam(param map[string]any) ([]string, []any) {
	var strs []string
	var vals []any
	for key, val := range param {
		strs = append(strs, key+" = ? ")
		vals = append(vals, val)
	}
	return strs, vals
}
