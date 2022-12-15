import { notifyState } from '@/shared/stores';
import { myAxiosPost } from '@/shared/utils/axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const sendComment = async (url: string, formData: FormData) => {
  await myAxiosPost(url, formData, {
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
        setNotify({ severity: 'info', text: 'コメントを保存しました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: '保存できませんでした' });
      },
    },
  );
};
