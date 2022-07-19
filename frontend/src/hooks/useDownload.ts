import { useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";
import { saveAs } from "file-saver";
import { sleep } from "../utils/sleep";
import { getRandom } from "../utils/random";

export type MyResponse = {
  name: string;
  type: "dir" | "file";
  data: Blob | null;
};

export type MyResponseProgress = {
  name: string;
  start: boolean;
  text: string;
  progress: number;
  status: "pending" | "fullfilled" | "suspended" | "finish";
};

export const useDownload = (path: string) => {
  const [myProgress, setMyProgress] = useState<MyResponseProgress[]>([]);
  const [responses, setResponses] = useState<MyResponse[]>([]);

  const handleCancel = async (name: string) => {
    onSetProgress(name, 0, 0, { status: "suspended", text: "中断しました。" });
    await sleep(5);
    setResponses(responses.filter((item) => item.name !== name));
    onSetProgress(name, 0, 0, { start: false });
  };

  const onSetProgress = (
    name: string,
    min: number,
    max: number,
    params?: Partial<MyResponseProgress>
  ) => {
    setMyProgress((old) =>
      old.map((item) => {
        if (item.name === name && item.status !== "suspended") {
          return {
            ...item,
            ...params,
            progress: getRandom(min, max),
          };
        }
        return item;
      })
    );
  };

  const downloadMutation = useMutation(
    async ({ name, type }: { name: string; type: "dir" | "file" }) => {
      const requestPromise = downloadRequest({ name, type });
      await sleep(3);
      [...Array(getRandom(30, 60))].forEach((_, i) =>
        onSetProgress(name, i, i)
      );
      await requestPromise
        .then((data: Blob) => {
          setResponses((old) =>
            old.map((item) => {
              if (item.name === name) {
                onSetProgress(name, 70, 85, {
                  text:
                    type === "dir"
                      ? `${name}.zip`
                      : name + "をダウンロードしています",
                });
                return { name, type, data };
              }
              return item;
            })
          );
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            setMyProgress((old) =>
              old.map((item) => {
                if (item.name === name) {
                  return {
                    ...item,
                    text: "エラーが発生しました",
                    status: "suspended",
                    start: false,
                  };
                }
                return item;
              })
            );
          }, 5 * 1000);
        });
      onSetProgress(name, 98, 99, { status: "fullfilled" });
    }
  );

  const saveFile = async (target: MyResponse) => {
    if (target.data !== null) {
      saveAs(
        target.data,
        target.type === "dir" ? `${target.name}.zip` : target.name
      );
      onSetProgress(target.name, 100, 100, {
        text: "完了",
        status: "finish",
      });
      await sleep(6);
      setResponses(responses.filter((item) => item.name !== target.name));
      onSetProgress(target.name, 0, 0, { start: false });
    }
  };

  const downloadRequest = async ({
    name,
    type,
  }: {
    name: string;
    type: "dir" | "file";
  }): Promise<any> => {
    setMyProgress((old) => [
      {
        name,
        start: true,
        text: type === "dir" ? "圧縮しています" : "ダウンロードしています",
        status: "pending",
        progress: 0,
      },
      ...old,
    ]);
    setResponses((old) => [{ name, type, data: null }, ...old]);
    return axios
      .get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/download?path=${path}&target=${name}&type=${type}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => res.data);
  };

  return {
    myProgress,
    responses,
    handleCancel,
    saveFile,
    downloadMutation,
  };
};
