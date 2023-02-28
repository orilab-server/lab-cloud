import { myAuthAxiosGet } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const rename = async (path: string, oldName: string, newName: string) => {
  await myAuthAxiosGet(`/request/rename?path=${path}&oldName=${oldName}&newName=${newName}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type RenameRequestMutationConfig = {
  path: string;
  oldName: string;
  newName: string;
};

export const useRename = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ path, oldName, newName }: RenameRequestMutationConfig) =>
      rename(path, oldName, newName),
    {
      onSuccess: async () => {
        setNotify({ severity: 'info', text: '名前を変更しました' });
        await queryClient.invalidateQueries('storage');
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
