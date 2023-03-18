import { myAuthAxiosPatch } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

// 本登録 → 本パスワードの設定
export const register = async (params: URLSearchParams) => {
  await myAuthAxiosPatch(`/user/password`, params, {
    xsrfHeaderName: 'X-CSRF-Token',
  });
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
