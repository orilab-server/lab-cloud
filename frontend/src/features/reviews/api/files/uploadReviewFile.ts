import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const uploadReviewFile = async (reviewId: string, formData: FormData) => {
  await myAuthAxiosPost(`/reviews/${reviewId}/files/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UploadFileMutationConfig = {
  reviewId: string;
  formData: FormData;
};

export const useUploadReviewFile = () => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ reviewId, formData }: UploadFileMutationConfig) => {
      await uploadReviewFile(reviewId, formData);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('review_files');
        setNotify({ severity: 'info', text: 'ファイルをアップロードしました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'アップロードに失敗しました' });
      },
    },
  );
};
