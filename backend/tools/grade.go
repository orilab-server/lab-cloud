package tools

func GradeStrFromNumber(grade int) string {
	if grade == 2 {
		return "学士3年"
	}
	if grade == 3 {
		return "学士4年"
	}
	if grade == 4 {
		return "修士1年"
	}
	if grade == 5 {
		return "修士2年"
	}
	return "その他"
}