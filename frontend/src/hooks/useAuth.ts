import { useSetRecoilState } from "recoil";
import { supabase } from "../lib/supabase";
import { notifyState } from "../store";
import { sleep } from "../utils/sleep";

export const useAuth = () => {
  const setNotify = useSetRecoilState(notifyState);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      setNotify({ severity: "info", text: "ログインしました" });
    } catch (error) {
      setNotify({ severity: "error", text: "ログインに失敗しました" });
      console.log(error);
    }
  };

  const additionalSignUp = async (
    userId: string | undefined,
    name: string,
    password: string
  ) => {
    try {
      const { error: registerError } = await supabase
        .from("users")
        .update([{ user_name: name }])
        .match({
          id: userId,
        });
      if (registerError) {
        throw registerError;
      }
      const { error: passwordError } = await supabase.auth.update({ password });
      if (passwordError) {
        throw passwordError;
      }
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
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
        setNotify({ severity: "info", text: "ログアウトしました" });
        await sleep(1);
        location.reload();
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
