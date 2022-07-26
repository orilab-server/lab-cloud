import axios from "axios";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { isTemporaryState, userNameState } from "../store";

export const useUser = () => {
  const setUserName = useSetRecoilState(userNameState);
  const setIsTemporary = useSetRecoilState(isTemporaryState);

  useQuery(
    "user",
    async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/home/user`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      setUserName(res.data.name);
      setIsTemporary(res.data.is_temporary);
    },
    {
      onError: (error) => console.log(error),
    }
  );
};
