import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { notifyState } from "../store";
import { MkRmRequest } from "../types/request";

export const useMkRmRequest = (path: string) => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);

  const requestMutation = useMutation(async (body: MkRmRequest) => {
    const formData = new FormData();
    formData.append("type", "command");
    formData.append("requestType", body.requestType);
    formData.append("dirName", body.dirName || "");
    formData.append("fileName", body.fileName || "");
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/?path=${path}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(res);
    setNotify({
      severity: "info",
      text:
        body.requestType.match("rm") !== null ? "削除しました" : "作成しました",
    });
    await queryClient.invalidateQueries("storage");
  });

  return {
    requestMutation,
  };
};
