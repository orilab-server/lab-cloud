import { getRandom } from '@/utils/random';
import { sleep } from '@/utils/sleep';
import axios from 'axios';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { Dispatch, SetStateAction, useState } from 'react';
import { useMutation } from 'react-query';
import { Response, ResponseProgress } from '../types/response';

export const downloadRequest = async (path: string, name: string, type: 'dir' | 'file') =>
  axios
    .get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/home/download?path=${path}&target=${name}&type=${type}`,
      {
        withCredentials: true,
        responseType: 'blob',
      },
    )
    .then((res) => res.data);

    export const getPreviewFile = async (path: string, name: string) => {
      const requestPromise = downloadRequest(path, name, 'file');
      return await requestPromise.then((data: Blob) => {
        return data;
      });
    };

const getProgress = (
  progresses: ResponseProgress[],
  name: string,
  min: number,
  max: number,
  params?: Partial<ResponseProgress>,
) => {
  return progresses.map((progress) => {
    if (progress.name === name && progress.status !== 'suspended') {
      return {
        ...progress,
        ...params,
        progress: getRandom(min, max),
      };
    }
    return progress;
  });
};

export const saveFile = async (target: Response | null) => {
  if (target !== null && target.data !== null) {
    const now = format(new Date(), 'yyyyMMdd');
    saveAs(target.data, target.type === 'dir' ? `${target.name}_${now}.zip` : target.name);
  }
};

export const download = async (
  path: string,
  target: { name: string; type: 'dir' | 'file' },
  setProgress: Dispatch<SetStateAction<ResponseProgress[]>>,
) => {
  const { name, type } = target;
  console.log(path, name, type);
  setProgress((old) => [
    ...old,
    {
      name,
      type,
      progress: 0,
      start: true,
      data: null,
      text: type === 'dir' ? '圧縮しています' : 'ダウンロードしています',
      status: 'pending',
    },
  ]);
  const requestPromise = downloadRequest(path, name, type);
  await sleep(3);
  [...Array(getRandom(30, 60))].forEach((_, i) =>
    setProgress((old) => getProgress(old, name, i, i)),
  );
  const res = await requestPromise
    .then((data: Blob) => {
      console.log(data);
      setProgress((old) =>
        getProgress(old, name, 70, 85, {
          text: type === 'dir' ? `${name}.zip` : name + 'をダウンロードしています',
          data,
        }),
      );
      return name;
    })
    .catch(async (error) => {
      console.log(error);
      setProgress((old) =>
        getProgress(old, name, 0, 0, {
          text: 'エラーが発生しました',
          status: 'suspended',
          start: false,
        }),
      );
      await sleep(6);
      setProgress((old) => old.filter((item) => item.name !== name));
      return null;
    });
  setProgress((old) => getProgress(old, name, 98, 99));
  return res || '';
};

export const cancel = async (
  name: string,
  setProgress: Dispatch<SetStateAction<ResponseProgress[]>>,
) => {
  setProgress((old) => getProgress(old, name, 0, 0, { status: 'suspended', text: '中断しました' }));
  await sleep(6);
  setProgress((old) => old.filter((item) => item.name !== name));
};

export type DownloadMutationConfig = {
  path: string;
  target: { name: string; type: 'dir' | 'file' };
};

export const useDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState<ResponseProgress[]>([]);
  const downloadMutation = useMutation(
    async (config: DownloadMutationConfig) =>
      download(config.path, config.target, setDownloadProgress),
    {
      onSuccess: async (name) => {
        setDownloadProgress((old) => getProgress(old, name, 100, 100, { status: 'finish' }));
        await sleep(6);
        setDownloadProgress((old) => old.filter((item) => item.name !== name));
      },
    },
  );
  const downloadCancelMutation = useMutation(
    async (name: string) => cancel(name, setDownloadProgress),
    {},
  );
  return { downloadProgress, downloadMutation, downloadCancelMutation };
};
