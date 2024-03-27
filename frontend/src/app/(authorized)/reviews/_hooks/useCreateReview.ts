'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { createReview } from '../_actions/createReview';

type CreateReviewMutationConfig = {
  formData: FormData;
};

export const useCreateReview = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(async ({ formData }: CreateReviewMutationConfig) => createReview(formData), {
    onSuccess: () => {
      setNotify({ severity: 'info', text: '新規レビューを作成しました' });
    },
    onError: (error) => {
      console.log(error);
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
