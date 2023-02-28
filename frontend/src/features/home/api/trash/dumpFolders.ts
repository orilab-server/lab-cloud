import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const dumpFolders = async (formData: FormData) => {
  await myAuthAxiosPost(`/home/trash/dirs/dump`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type DumpFoldersRequestMutationConfig = {
  formData: FormData;
};

export const useDumpFolders = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ formData }: DumpFoldersRequestMutationConfig) => dumpFolders(formData),
    {
      onSuccess: async () => {
        setNotify({ severity: 'info', text: 'ゴミ箱に移動しました' });
        await queryClient.invalidateQueries('storage');
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
