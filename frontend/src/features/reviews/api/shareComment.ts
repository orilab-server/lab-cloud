import { notifyState } from '@/shared/stores';
import { myAxiosPost } from '@/shared/utils/axios';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const shareComment = async (url: string, formData: FormData) => {
  await myAxiosPost(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type ShareCommentMutationConfig = {
  url: string;
  formData: FormData;
};

export const useShareComment = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ url, formData }: ShareCommentMutationConfig) => await shareComment(url, formData),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'レビューを通知しました' });
      },
      onError: (error) => {
        setNotify({ severity: 'error', text: '通知に失敗しました' });
      },
    },
  );
};
