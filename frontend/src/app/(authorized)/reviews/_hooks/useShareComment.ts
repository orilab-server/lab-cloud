'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { shareComment } from '../_actions/shareComments';

export const useShareComment = (reviewId: string, fileId: string, userId: number) => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(async () => await shareComment(reviewId, fileId, userId), {
    onSuccess: () => {
      setNotify({ severity: 'info', text: 'レビューを通知しました' });
    },
    onError: (error) => {
      setNotify({ severity: 'error', text: '通知に失敗しました' });
    },
  });
};
