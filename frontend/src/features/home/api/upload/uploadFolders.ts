import { foldersState, folderUploadProgressesState, notifyState } from '@/shared/stores';
import { myAxiosPost } from '@/shared/utils/axios';
import { sleep } from '@/shared/utils/sleep';
import { freeLengthStrSlicer } from '@/shared/utils/slice';
import { useMutation, useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UploadFolderProgress } from '../../types/upload';

const batchSize = 10;

export const useUploadFolders = () => {
  const [folders, setFolders] = useRecoilState(foldersState);
  const [folderUploadProgresses, setFolderUploadProgresses] = useRecoilState(
    folderUploadProgressesState,
  );
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const uploadProgresses = [
        ...folderUploadProgresses,
        ...folders.map((folder) => {
          const totalSize = folder.files.reduce((sum, cur) => {
            return sum + cur.size;
          }, 0);
          return {
            name: folder.name,
            path: folder.path,
            target: folder,
            progress: 0,
            text: `${freeLengthStrSlicer(folder.name, 10, true)}をアップロードしています`,
            totalSize,
            totalLoadedSize: 0,
            loadedSize: 0,
            status: 'pending',
          };
        }),
      ] as UploadFolderProgress[];
      setFolderUploadProgresses(uploadProgresses);
      setFolders([]);
      await sleep(6);
      setFolderUploadProgresses((olds) => olds.map((old) => ({ ...old, status: 'start' })));
      await Promise.all(
        uploadProgresses.map(async (item) => {
          const chunks = (() => {
            const files = item.target.files;
            const fileNames = item.target.fileNames;
            if (files.length <= batchSize) {
              return { files: [files], fileNames: [fileNames] };
            }
            const chunkSize = (() => {
              const surplus = files.length / batchSize;
              const size = Math.floor(files.length / batchSize);
              return surplus === 0 ? size : size + 1;
            })();
            const fileChunks = Array(chunkSize)
              .fill(0)
              .map((_, index) => files.slice(batchSize * index, batchSize * (index + 1)));
            const fileNameChunks = Array(chunkSize)
              .fill(0)
              .map((_, index) => fileNames.slice(batchSize * index, batchSize * (index + 1)));
            return { files: fileChunks, fileNames: fileNameChunks };
          })();

          const uploadChunks = chunks.files.map(async (fileChunks, index) => {
            const fileNameChunks = chunks.fileNames[index];
            const formData = new FormData();
            formData.append('requestType', 'dirs');
            fileChunks.forEach((file) => formData.append('files', file));
            formData.append('filePaths', fileNameChunks.join(' // '));
            const res = await myAxiosPost(`home/upload?path=${item.path}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
              .then(() => ({ error: null }))
              .catch((error) => ({ error }));
            if (res.error !== null) {
              throw res.error;
            }
            setFolderUploadProgresses((olds) =>
              olds.map((old) => {
                if (old.path + old.name === item.path + item.name) {
                  return {
                    ...old,
                    progress: Math.round(((old.loadedSize + 1) / chunks.files.length) * 100),
                    loadedSize: old.loadedSize + 1,
                    status: old.progress >= 95 ? 'finish' : old.status,
                  };
                }
                return old;
              }),
            );
          });
          await Promise.all(uploadChunks);
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
        setFolderUploadProgresses([]);
      },
    },
  );
};
