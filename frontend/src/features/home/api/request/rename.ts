import { notifyState } from '@/shared/stores';
import { myAxiosGet } from '@/shared/utils/axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const sendRenameRequest = async (oldName: string, newName: string) => {
  await myAxiosGet(`home/request/rename?oldName=${oldName}&newName=${newName}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type RenameRequestMutationConfig = {
  oldName: string;
  newName: string;
};

export const useRenameRequest = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async (config: RenameRequestMutationConfig) =>
      sendRenameRequest(config.oldName, config.newName),
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
