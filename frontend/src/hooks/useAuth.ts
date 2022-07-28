import axios from "axios";
import { useSetRecoilState } from "recoil";
import {
  isLoginState,
  isTemporaryState,
  notifyState,
  sessionState,
  userNameState,
} from "../store";

export const useAuth = () => {
  const setNotify = useSetRecoilState(notifyState);
  const setIsLogin = useSetRecoilState(isLoginState);
  const setSession = useSetRecoilState(sessionState);
  const setUserName = useSetRecoilState(userNameState);
  const setIsTemporary = useSetRecoilState(isTemporaryState);

  const signIn = async (params: URLSearchParams) => {
    try {
      const loginPost = axios.create({
        xsrfHeaderName: "X-CSRF-Token",
        withCredentials: true,
      });
      await loginPost
        .post(`${import.meta.env.VITE_SERVER_URL}/login`, params)
        .then(() => {
          const cookies = document.cookie.split(";");
          for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === "mysession" && value !== "") {
              setSession(value);
              break;
            }
          }
        });
      setNotify({ severity: "info", text: "ログインしました" });
    } catch (error) {
      setNotify({ severity: "error", text: "ログインに失敗しました" });
      console.log(error);
    }
  };

  const additionalSignUp = async (params: URLSearchParams) => {
    try {
      const signupPost = axios.create({
        xsrfHeaderName: "X-CSRF-Token",
        withCredentials: true,
      });
      await signupPost.patch(
        `${import.meta.env.VITE_SERVER_URL}/home/user`,
        params
      );
      setIsTemporary(false);
      setNotify({ severity: "info", text: "登録しました" });
    } catch (error) {
      setNotify({ severity: "error", text: "登録に失敗しました" });
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      const ok = window.confirm("ログアウトしますか？");
      if (ok) {
        await axios
          .get(`${import.meta.env.VITE_SERVER_URL}/home/logout`, {
            withCredentials: true,
          })
          .then(() => {
            document.cookie = "mysession=;";
            setIsLogin(false);
            setSession(null);
            setUserName(null);
          });
        setNotify({ severity: "info", text: "ログアウトしました" });
      }
    } catch (error) {
      setNotify({ severity: "error", text: "ログアウトに失敗しました" });
      console.log(error);
    }
  };

  return {
    signIn,
    additionalSignUp,
    signOut,
  };
};
