import { filesState, fileUploadProgressesState, notifyState } from '@/shared/stores';
import { myAxiosPost } from '@/shared/utils/axios';
import { sleep } from '@/shared/utils/sleep';
import { freeLengthStrSlicer } from '@/shared/utils/slice';
import { useMutation, useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UploadFileProgress } from '../../types/upload';

export const useUploadFiles = () => {
  const [files, setFiles] = useRecoilState(filesState);
  const [fileUploadProgresses, setFileUploadProgresses] = useRecoilState(fileUploadProgressesState);
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const uploadProgresses = [
        ...fileUploadProgresses,
        ...(files.map((item) => ({
          name: item.file.name,
          path: item.path,
          target: item,
          progress: 0,
          text: `${freeLengthStrSlicer(item.file.name, 10, true)}をアップロードしています`,
          status: 'pending',
        })) as UploadFileProgress[]),
      ];
      setFileUploadProgresses(uploadProgresses);
      setFiles([]);
      await sleep(5);
      setFileUploadProgresses((olds) => olds.map((old) => ({ ...old, status: 'start' })));
      await Promise.all(
        uploadProgresses.map(async (item) => {
          const formData = new FormData();
          formData.append('requestType', 'files');
          formData.append('files', item.target.file);
          const res = await myAxiosPost(`home/upload?path=${item.path}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const progress = Math.round((loaded / total) * 100);
              const newItem = (() => {
                if (progress >= 99) {
                  return {
                    ...item,
                    progress,
                    text: `${freeLengthStrSlicer(item.name, 10, true)}をアップロードしました`,
                    status: 'finish',
                  };
                }
                return {
                  ...item,
                  progress,
                };
              })() as UploadFileProgress;
              setFileUploadProgresses((olds) =>
                olds.map((old) => {
                  if (newItem.path + newItem.name === old.path + old.name) {
                    return { ...old, progress };
                  }
                  return old;
                }),
              );
            },
          })
            .then(() => ({ error: null }))
            .catch((error) => ({ error }));
          if (res.error !== null) {
            throw res.error;
          }
        }),
      );
      return uploadProgresses;
    },
    {
      onSettled: async (res) => {
        if (!res) {
          setNotify({
            severity: 'error',
            text: 'エラーが発生しました',
          });
        } else {
          let itemCount = 0;
          for (const item of res) {
            if (Boolean(localStorage.getItem(`cancel_upload_${item.name}`))) {
              itemCount += 1;
              const formData = new FormData();
              formData.append('requestType', 'cancel');
              formData.append('dirName', item.name);
              await myAxiosPost(`home/upload?path=${item.path}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }).finally(() => localStorage.removeItem(`cancel_upload_${item.name}`));
            }
          }
          if (itemCount < res.length) {
            await queryClient.invalidateQueries('storage');
            setNotify({ severity: 'info', text: 'アップロードしました' });
          }
        }
        await sleep(10);
        setFileUploadProgresses([]);
      },
    },
  );
};
