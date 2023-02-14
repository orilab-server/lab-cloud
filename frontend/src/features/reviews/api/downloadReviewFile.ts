import { myAuthAxiosGet } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { endFilenameSlicer, withoutLastPathSlicer } from '@/shared/utils/slice';
import { saveAs } from 'file-saver';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const downloadReviewFile = async (url: string, filePath: string) => {
  const fileName = endFilenameSlicer(filePath);
  await myAuthAxiosGet<Blob>(`${url}?path=${withoutLastPathSlicer(filePath)}&file=${fileName}`, {
    responseType: 'blob',
  }).then((res) => {
    console.log(res.data);
    saveAs(res.data, fileName);
  });
};

type DownloadReviewFileMutation = {
  url: string;
  filePath: string;
};

export const useDownloadReviewFile = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ url, filePath }: DownloadReviewFileMutation) =>
      await downloadReviewFile(url, filePath),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'ダウンロードしました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'ダウンロードに失敗しました' });
      },
    },
  );
};
