import { useUser } from '@/features/auth/api/getUser';
import { myAuthAxiosGet } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const shareComment = async (
  reviewId: string,
  fileId: string,
  userId: number | undefined,
) => {
  if (!userId) {
    throw new Error('user not found');
  }
  await myAuthAxiosGet(`/reviews/${reviewId}/files/${fileId}/own/${userId}/comments/share`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const useShareComment = () => {
  const setNotify = useSetRecoilState(notifyState);
  const router = useRouter();
  const reviewId = router.query.review_id as string;
  const fileId = router.query.file_id as string;
  const userQuery = useUser();

  return useMutation(async () => await shareComment(reviewId, fileId, userQuery.data?.id), {
    onSuccess: () => {
      setNotify({ severity: 'info', text: 'レビューを通知しました' });
    },
    onError: (error) => {
      setNotify({ severity: 'error', text: '通知に失敗しました' });
    },
  });
};
