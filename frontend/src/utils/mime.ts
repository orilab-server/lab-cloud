export const getMimeType = (fileName: string) => {
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  switch (fileExtension) {
    case "txt":
      return "text/plain";
    case "htm":
    case "html":
      return "text/html";
    case "xml":
      return "text/xml";
    case "js":
      return "text/javascript";
    case "vbs":
      return "text/vbscript";
    case "css":
      return "text/css";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "cgi":
      return "application/x-httpd-cgi";
    case "doc":
    case "docx":
      return "application/msword";
    case "pdf":
      return "application/pdf";
    default:
      return "";
  }
};
