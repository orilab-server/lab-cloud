import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const createReview = async (formData: FormData) => {
  await myAuthAxiosPost('/reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type CreateReviewMutationConfig = {
  formData: FormData;
};

export const useCreateReview = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async ({ formData }: CreateReviewMutationConfig) => createReview(formData), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('reviews');
      setNotify({ severity: 'info', text: '新規レビューを作成しました' });
    },
    onError: (error) => {
      console.log(error);
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
