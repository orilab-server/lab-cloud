'use client';

import { notifyState } from '@/app/_shared/stores';
import { sleep } from '@/app/_shared/utils/sleep';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { getUploadStreamReader } from '../_actions/upload';
import { fileUploadProgressesState } from '../_stores';

export const useUploadFiles = () => {
  const setNotify = useSetRecoilState(notifyState);
  const [progresses, setProgresses] = useRecoilState(fileUploadProgressesState);

  return useMutation(
    async () => {
      await Promise.all(
        progresses.map(async (p) => {
          const total = p.target.file.size;
          const formData = new FormData();
          formData.append('file', p.target.file);
          const reader = await getUploadStreamReader(
            `/upload/file?path=${p.target.path}`,
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
