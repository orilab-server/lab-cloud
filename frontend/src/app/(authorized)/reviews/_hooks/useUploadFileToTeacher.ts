'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { uploadFileToTeacher } from '../_actions/uploadReviewFileForTeacher';

type UploadFileMutationConfig = {
  reviewId: string;
  reviewedId: string;
  formData: FormData;
};

export const useUploadReviewFileForTeacher = (type?: 'pdf' | 'docx') => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ reviewId, reviewedId, formData }: UploadFileMutationConfig) => {
      await uploadFileToTeacher(reviewId, reviewedId, formData);
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
