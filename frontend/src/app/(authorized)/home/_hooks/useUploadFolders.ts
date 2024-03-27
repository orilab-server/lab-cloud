'use client';

import { notifyState } from '@/app/_shared/stores';
import { sleep } from '@/app/_shared/utils/sleep';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { getUploadStreamReader } from '../_actions/upload';
import { folderUploadProgressesState } from '../_stores';

export const useUploadFolders = () => {
  const setNotify = useSetRecoilState(notifyState);
  const [progresses, setProgresses] = useRecoilState(folderUploadProgressesState);

  return useMutation(
    async () => {
      await Promise.all(
        progresses.map(async (p) => {
          let total = 0;
          const formData = new FormData();
          p.target.files.forEach((f) => {
            formData.append('files', f);
            total += f.size;
          });
          const reader = await getUploadStreamReader(
            `/upload/folder?path=${p.target.path}`,
            formData,
          );
          let uploadSize = 0;
          while (reader) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            uploadSize += value.length;
            const progress = Math.floor((uploadSize * 100) / total);
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
          }

          await sleep(3);
          setProgresses((old) => old.filter((o) => o.name !== p.name));
        }),
      );
    },
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'アップロードしました！' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
