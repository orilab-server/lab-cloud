import { downloadProgressesState, notifyState } from '@/shared/stores';
import { myAxiosGet } from '@/shared/utils/axios';
import { sleep } from '@/shared/utils/sleep';
import { freeLengthStrSlicer } from '@/shared/utils/slice';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { DownloadProgress } from '../../types/download';
import { FileOrDirItem } from '../../types/storage';

type DownloadMutationConfig = {
  path: string;
  targets: FileOrDirItem[];
};

export const useDownload = () => {
  const [downloadProgresses, setDownloadProgress] = useRecoilState(downloadProgressesState);
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ path, targets }: DownloadMutationConfig) => {
      const progresses = [
        ...downloadProgresses,
        ...targets.map((target) => ({
          name: target.name,
          text: `${freeLengthStrSlicer(target.name, 10, true)}をダウンロードしています`,
          type: target.type,
          progress: 0,
          status: 'pending',
        })),
      ] as DownloadProgress[];
      setDownloadProgress(progresses.filter((item) => item.status !== 'finish'));
      await sleep(6);
      return await Promise.all(
        progresses.map(async (target) => {
          const res = await myAxiosGet<Blob>(
            `home/download?path=${path}&target=${target.name}&type=${target.type}`,
            {
              responseType: 'blob',
              onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const progress = Math.round((loaded / total) * 100);
                setDownloadProgress((olds) =>
                  olds.map((old) => {
                    if (target.name === old.name) {
                      if (progress >= 99) {
                        return {
                          ...old,
                          text: `${freeLengthStrSlicer(
                            target.name,
                            10,
                            true,
                          )}をダウンロードしました`,
                          progress,
                          status: 'finish',
                        };
                      }
                      return { ...old, progress };
                    }
                    return old;
                  }),
                );
              },
            },
          );
          return { name: target.name, data: res.data, type: target.type };
        }),
      );
    },
    {
      onSettled: async (res) => {
        if (res) {
          let downloadCount = 0;
          for (const item of res) {
            if (localStorage.getItem(`download_cancel_${item.name}`)) {
              localStorage.removeItem(`download_cancel_${item.name}`);
              continue;
            }
            downloadCount += 1;
            const now = format(new Date(), 'yyyyMMdd');
            saveAs(item.data, `${item.name}${item.type === 'dir' ? '_' + now + '.zip' : ''}`);
          }
          if (downloadCount > 0) {
            setNotify({ severity: 'info', text: 'ダウンロードが完了しました' });
          }
        } else {
          setNotify({ severity: 'error', text: 'ダウンロードに失敗しました' });
        }
        await sleep(6);
        setDownloadProgress([]);
      },
    },
  );
};
