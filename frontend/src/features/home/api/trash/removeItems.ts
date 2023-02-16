import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const removeItems = async (formData: FormData) => {
  await myAuthAxiosPost(`/home/trash/files/remove`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type MvTrashRequestMutationConfig = {
  formData: FormData;
};

export const useRemoveItems = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async ({ formData }: MvTrashRequestMutationConfig) => removeItems(formData), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: 'ゴミ箱から削除しました' });
      await queryClient.invalidateQueries('trash');
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
