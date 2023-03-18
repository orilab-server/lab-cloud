import { myAuthAxiosGet } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { sleep } from '@/shared/utils/sleep';
import { extractDateInStr } from '@/shared/utils/slice';
import { saveAs } from 'file-saver';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { downloadProgressesState } from '../../modules/stores';

export const useDownload = () => {
  const setNotify = useSetRecoilState(notifyState);
  const [progresses, setProgresses] = useRecoilState(downloadProgressesState);

  return useMutation(
    async () => {
      await Promise.all(
        progresses.map(async (p) => {
          if (p.type === 'file') {
            const blob = await myAuthAxiosGet<Blob>(
              `/download/file?path=${p.path}&name=${p.name}`,
              {
                responseType: 'blob',
                onDownloadProgress(progressEvent) {
                  const { loaded, total } = progressEvent;
                  const progress = Math.floor((loaded * 100) / total);
                  setProgresses((old) => [
                    ...old,
                    {
                      ...old.find((o) => o.name === p.name)!,
                      status: progress >= 100 ? 'finished' : 'pending',
                      progress,
                    },
                  ]);
                },
              },
            ).then((res) => res.data);
            const [fileName] = extractDateInStr(p.name);
            saveAs(blob, fileName);
          }
          if (p.type === 'dir') {
            const blob = await myAuthAxiosGet<Blob>(
              `/download/folder?path=${p.path}&name=${p.name}`,
              {
                responseType: 'blob',
                onDownloadProgress(progressEvent) {
                  const { loaded, total } = progressEvent;
                  const progress = Math.floor((loaded * 100) / total);
                  setProgresses((old) => [
                    ...old,
                    {
                      ...old.find((o) => o.name === p.name)!,
                      status: progress >= 100 ? 'finished' : 'pending',
                      progress,
                    },
                  ]);
                },
              },
            ).then((res) => res.data);
            saveAs(blob, `${p.name}.zip`);
          }
          await sleep(3);
          setProgresses((old) => old.filter((o) => p.name !== o.name));
        }),
      );
    },
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'ダウンロードしました！' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
