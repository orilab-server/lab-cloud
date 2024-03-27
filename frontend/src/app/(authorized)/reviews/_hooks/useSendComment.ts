'use client';

import { notifyState } from '@/app/_shared/stores';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { sendComment } from '../_actions/sendComment';

type SendCommentMutationConfig = {
  formData: FormData;
};

export const useSendComment = (index: number) => {
  const setNotify = useSetRecoilState(notifyState);
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('review_id') || '';
  const fileId = searchParams.get('file_id') || '';

  return useMutation(
    async ({ formData }: SendCommentMutationConfig) =>
      await sendComment(reviewId, fileId, index, formData),
    {
      onSuccess: async () => {
        setNotify({ severity: 'info', text: 'コメントを登録しました' });
      },
    },
  );
};
