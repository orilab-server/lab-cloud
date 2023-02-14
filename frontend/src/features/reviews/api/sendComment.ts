import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const sendComment = async (url: string, formData: FormData) => {
  await myAuthAxiosPost(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type SendCommentMutationConfig = {
  formData: FormData;
};

export const useSendComment = (url: string) => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ formData }: SendCommentMutationConfig) => sendComment(url, formData),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('comment');
        await queryClient.invalidateQueries('reviewed_files');
        setNotify({ severity: 'info', text: 'コメントを保存しました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: '保存できませんでした' });
      },
    },
  );
};
