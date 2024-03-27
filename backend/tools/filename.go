package tools

import (
	"fmt"
	"path/filepath"
	"strings"
	"time"
)

func GetFilenameWithFormatNow(filename string) string {
	formatNow := time.Now().Format("2006-01-02 15:04")
	fileExt := filepath.Ext(filename)
	return fmt.Sprintf("%s_%s%s", filename[:strings.Index(filename, ".")], formatNow, fileExt)
}
