import { notifyState } from '@/stores';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

// ゴミ箱ディレクトリから元の場所に戻すAPIリクエスト
export const sendMvPastLocationRequest = async (ids: string[]) => {
  await Promise.all(
    ids.map(async (id) => {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/home/request/mv?byTrash=true&id=${id}`;
      await axios.get(url, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }),
  );
};

export const useMvPastLocationRequest = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async (ids: string[]) => sendMvPastLocationRequest(ids), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: '元の場所に戻しました' });
      await queryClient.invalidateQueries('storage');
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
