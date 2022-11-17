import { notifyState } from '@/shared/stores';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const register = async (params: URLSearchParams) => {
  const signupPost = axios.create({
    xsrfHeaderName: 'X-CSRF-Token',
    withCredentials: true,
  });
  await signupPost.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/home/user`, params);
};

type RegisterMutationConfig = {
  params: URLSearchParams;
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);
  return useMutation(async (config: RegisterMutationConfig) => register(config.params), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: '登録しました' });
      await queryClient.invalidateQueries('user');
    },
    onError: () => {
      setNotify({
        severity: 'error',
        text: 'エラーが発生しました',
      });
    },
  });
};
