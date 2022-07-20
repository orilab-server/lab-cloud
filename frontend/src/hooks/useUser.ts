import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { supabase } from "../lib/supabase";
import { userNameState } from "../store";

export const useUser = () => {
  const setUserName = useSetRecoilState(userNameState);
  const user = supabase.auth.user();

  useQuery(
    "user",
    async () => {
      const { data, error } = await supabase
        .from<{ user_name: string }>("users")
        .select("user_name")
        .match({ id: user?.id });
      if (error) {
        throw error;
      }
      setUserName(data[0].user_name);
    },
    {
      onError: (error) => console.log(error),
    }
  );

  return {
    user,
  };
};
