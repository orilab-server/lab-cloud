import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const restoreItems = async (formData: FormData) => {
  await myAuthAxiosPost(`/home/trash/files/restore`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type MvTrashRequestMutationConfig = {
  formData: FormData;
};

export const useRestoreItems = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async ({ formData }: MvTrashRequestMutationConfig) => restoreItems(formData), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: '元の場所に戻しました' });
      await queryClient.invalidateQueries('trash');
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
