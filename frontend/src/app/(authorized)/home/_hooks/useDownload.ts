'use client';

import { notifyState } from '@/app/_shared/stores';
import { sleep } from '@/app/_shared/utils/sleep';
import { extractDateInStr } from '@/app/_shared/utils/slice';
import { saveAs } from 'file-saver';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { getBlobStreamReader } from '../_actions/download';
import { downloadProgressesState } from '../_stores';

export const useDownload = () => {
  const setNotify = useSetRecoilState(notifyState);
  const [progresses, setProgresses] = useRecoilState(downloadProgressesState);

  const processStreaming = async (
    reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
    total: number,
    targetName: string,
  ) => {
    let downloadSize = 0;
    while (reader) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      downloadSize += value.length;
      const progress = Math.floor((downloadSize * 100) / total);
      setProgresses((old) => [
        ...old,
        {
          ...old.find((o) => o.name === targetName)!,
          status: progress >= 100 ? 'finished' : 'pending',
          progress,
        },
      ]);
    }
  };

  return useMutation(
    async () => {
      await Promise.all(
        progresses.map(async (p) => {
          if (p.type === 'file') {
            const { blobPromise, reader, total } = await getBlobStreamReader(
              `/download/file?path=${p.path}&name=${p.name}`,
            );
            await processStreaming(reader, total, p.name);

            const blob = await blobPromise;
            const [fileName] = extractDateInStr(p.name);
            saveAs(blob, fileName);
          }

          if (p.type === 'dir') {
            const { blobPromise, reader, total } = await getBlobStreamReader(
              `/download/folder?path=${p.path}&name=${p.name}`,
            );
            await processStreaming(reader, total, p.name);

            const blob = await blobPromise;
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
