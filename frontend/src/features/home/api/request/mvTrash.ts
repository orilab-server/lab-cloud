import { notifyState } from '@/stores';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { MvTrashRequest } from '../../types/request';

export const sendMvTrashRequest = async (targets: MvTrashRequest[]) => {
  await Promise.all(
    targets.map(async (target) => {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/home/request/mv-trash?path=${target.path}&itemType=${target.itemType}`;
      await axios.get(url, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }),
  );
};

export const useMvTrashRequest = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async (targets: MvTrashRequest[]) => sendMvTrashRequest(targets), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: 'ゴミ箱に移動しました' });
      await queryClient.invalidateQueries('storage');
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
