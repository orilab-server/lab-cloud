import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { sleep } from '@/shared/utils/sleep';
import { useMutation, useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { folderUploadProgressesState } from '../../modules/stores';

export const useUploadFolders = () => {
  const setNotify = useSetRecoilState(notifyState);
  const [progresses, setProgresses] = useRecoilState(folderUploadProgressesState);
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      await Promise.all(
        progresses.map(async (p) => {
          const formData = new FormData();
          p.target.files.forEach((f) => formData.append('files', f));
          await myAuthAxiosPost(`/upload/folder?path=${p.target.path}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress(progressEvent) {
              const { loaded, total } = progressEvent;
              const progress = Math.floor((loaded * 100) / total);
              setProgresses((old) => {
                return [
                  ...old,
                  {
                    ...old.find((o) => o.name === p.name)!,
                    status: progress >= 100 ? 'finished' : 'pending',
                    progress,
                  },
                ];
              });
            },
          }).finally(async () => {
            await sleep(3);
            setProgresses((old) => old.filter((o) => o.name !== p.name));
          });
        }),
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('storage');
        setNotify({ severity: 'info', text: 'アップロードしました！' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
