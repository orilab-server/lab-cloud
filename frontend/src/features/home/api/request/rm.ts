import { notifyState } from '@/shared/stores';
import { myAxiosGet } from '@/shared/utils/axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { RmRequest } from '../../types/request';

export const sendRmRequest = async (targets: RmRequest[]) => {
  await Promise.all(
    targets.map(async (target) => {
      await myAxiosGet(`home/request/rm-${target.type}?path=${target.path}&id=${target.id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }),
  );
};

export const useRmRequest = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async (targets: RmRequest[]) => sendRmRequest(targets), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: 'ゴミ箱から削除しました' });
      await queryClient.invalidateQueries('storage');
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
