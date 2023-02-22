import { myAuthAxiosGet } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const createFolder = async (path: string) => {
  await myAuthAxiosGet(`/request/mkdir?path=${path}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type CreateFolderMutationConfig = {
  path: string;
};

export const useCreateFolder = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async ({ path }: CreateFolderMutationConfig) => createFolder(path), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: '作成しました' });
      await queryClient.invalidateQueries('storage');
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
