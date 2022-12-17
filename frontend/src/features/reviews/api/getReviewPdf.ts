import { pdfReviewState } from '@/shared/stores';
import { myAxiosGet } from '@/shared/utils/axios';
import { getMimeType } from '@/shared/utils/mime';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export const getReviewPdf = async (url: string, fileName: string) => {
  const blob = await myAxiosGet<Blob>(`${url}&file=${fileName}`, {
    responseType: 'blob',
  });
  const asFile = new File([blob.data], fileName, {
    type: getMimeType(fileName),
  });
  return URL.createObjectURL(asFile);
};

export const usePdfReview = (pathName: string) => {
  const pdfReview = useRecoilValue(pdfReviewState);
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (pdfReview !== null) {
      setLoading(true);
      getReviewPdf(
        `${pathName}/${pdfReview.fileId}/download?path=${pdfReview.path}`,
        pdfReview.fileName,
      )
        .then(async (res) => {
          setUrl(res);
        })
        .finally(() => setLoading(false));
    }
    if (pdfReview === null && url) {
      URL.revokeObjectURL(url);
      setUrl('');
    }
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
        setUrl('');
      }
    };
  }, []);

  return { url, loading };
};
