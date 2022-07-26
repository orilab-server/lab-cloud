export const getCookie = (myKey: string) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === myKey) {
      return value;
    }
  }
  return "";
};
