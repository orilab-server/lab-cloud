import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const sendMkReviewDirRequest = async (formData: FormData) => {
  await myAuthAxiosPost('/reviews/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type SendMkdirRequestMutationConfig = {
  formData: FormData;
};

export const useSendMkReviewDirRequest = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ formData }: SendMkdirRequestMutationConfig) => sendMkReviewDirRequest(formData),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('reviews');
        setNotify({ severity: 'info', text: 'レビュー用ディレクトリを作成しました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
