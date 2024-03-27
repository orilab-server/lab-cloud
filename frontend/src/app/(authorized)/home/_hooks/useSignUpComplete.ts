'use client';

import { myAuthAxiosPatch } from '@/app/_shared/lib/axios';
import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
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

export const useSignUpComplete = () => {
  const setNotify = useSetRecoilState(notifyState);
  return useMutation(async (config: RegisterMutationConfig) => register(config.params), {
    onSuccess: () => {
      setNotify({ severity: 'info', text: '登録しました' });
    },
    onError: () => {
      setNotify({
        severity: 'error',
        text: 'エラーが発生しました',
      });
    },
  });
};
