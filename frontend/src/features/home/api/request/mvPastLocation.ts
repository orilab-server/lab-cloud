import { myAuthAxiosGet } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

// ゴミ箱ディレクトリから元の場所に戻すAPIリクエスト
export const sendMvPastLocationRequest = async (ids: string[]) => {
  await Promise.all(
    ids.map(async (id) => {
      await myAuthAxiosGet(`/request/mv?byTrash=true&id=${id}`, {
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
