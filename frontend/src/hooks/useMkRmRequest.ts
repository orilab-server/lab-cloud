import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { MkRmRequest } from "../types/request";

export const useMkRmRequest = (path: string) => {
  const queryClient = useQueryClient();

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
    await queryClient.invalidateQueries("storage");
  });

  return {
    requestMutation,
  };
};
