import { pdfReviewState } from '@/shared/stores';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { getPreviewFile } from './previewFile';

export const usePdfReview = () => {
  const pdfReview = useRecoilValue(pdfReviewState);
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (pdfReview !== null) {
      getPreviewFile(pdfReview.path, pdfReview.fileName).then(async (res) => {
        setUrl(res);
      });
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

  return { url };
};
