import { notifyState } from '@/stores';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const sendMkdirRequest = async (path: string) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/home/request/mkdir?path=${path}`;
  await axios.get(url, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const useMkdirhRequest = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async (path: string) => sendMkdirRequest(path), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: '作成しました' });
      await queryClient.invalidateQueries('storage');
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
