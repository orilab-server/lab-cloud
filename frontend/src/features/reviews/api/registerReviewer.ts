import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const registerReviewer = async (url: string, formData: FormData) => {
  await myAuthAxiosPost(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type RegisterReviewerMutationConfig = {
  url: string;
  formData: FormData;
};

export const useRegisterReviewer = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ url, formData }: RegisterReviewerMutationConfig) =>
      await registerReviewer(url, formData),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('reviewers');
        setNotify({ severity: 'info', text: 'レビュアーとして登録しました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: '登録に失敗しました' });
      },
    },
  );
};
