'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { deleteReviewFile } from '../_actions/deleteFile';

type DeleteReviewFileMutationConfig = {
  reviewId: string;
  fileId: string;
};

export const useDeleteReviewFile = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation({
    mutationFn: async ({ reviewId, fileId }: DeleteReviewFileMutationConfig) =>
      deleteReviewFile(reviewId, fileId),
    onSuccess: () => {
      setNotify({ severity: 'info', text: 'ファイルを削除しました！' });
    },
    onError: (error) => {
      console.log(error);
      setNotify({ severity: 'error', text: 'ファイルを削除できませんでした' });
    },
  });
};
