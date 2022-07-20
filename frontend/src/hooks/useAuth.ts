import { useSetRecoilState } from "recoil";
import { supabase } from "../lib/supabase";
import { notifyState } from "../store";

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
    } catch (error) {
      setNotify({ severity: "error", text: "ログインに失敗しました" });
      console.log(error);
    }
  };

  return {
    signIn,
  };
};
