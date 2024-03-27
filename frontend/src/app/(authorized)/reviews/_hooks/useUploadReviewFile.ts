'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { uploadReviewFile } from '../_actions/uploadReviewFile';

type UploadFileMutationConfig = {
  reviewId: string;
  formData: FormData;
};

export const useUploadReviewFile = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ reviewId, formData }: UploadFileMutationConfig) => {
      await uploadReviewFile(reviewId, formData);
    },
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'ファイルをアップロードしました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'アップロードに失敗しました' });
      },
    },
  );
};
