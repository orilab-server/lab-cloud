import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const dumpFiles = async (formData: FormData) => {
  await myAuthAxiosPost(`/home/trash/files/dump`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type MvTrashRequestMutationConfig = {
  formData: FormData;
};

export const useDumpFiles = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async ({ formData }: MvTrashRequestMutationConfig) => dumpFiles(formData), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: 'ゴミ箱に移動しました' });
      await queryClient.invalidateQueries('storage');
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
