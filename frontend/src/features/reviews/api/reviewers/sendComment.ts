import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const sendComment = async (
  reviewId: string,
  fileId: string,
  index: number,
  formData: FormData,
) => {
  await myAuthAxiosPost(`/reviews/${reviewId}/files/${fileId}/comments/${index}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type SendCommentMutationConfig = {
  formData: FormData;
};

export const useSendComment = (index: number) => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();
  const router = useRouter();
  const reviewId = router.query.review_id as string;
  const fileId = router.query.file_id as string;

  return useMutation(
    async ({ formData }: SendCommentMutationConfig) =>
      await sendComment(reviewId, fileId, index, formData),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(`comment-${index}`);
        setNotify({ severity: 'info', text: 'コメントを登録しました' });
      },
    },
  );
};
