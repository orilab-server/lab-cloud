'use client';

import { myAxiosPatch, myAxiosPost } from '@/app/_shared/lib/axios';
import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const resetPassword = async (param: FormData | URLSearchParams, request?: boolean) => {
  if (request) {
    await myAxiosPost('/user/reset-password/request', param as FormData, {
      xsrfHeaderName: 'X-CSRF-Token',
    });
    return true;
  }
  await myAxiosPatch('/user/reset-password', param as URLSearchParams, {
    xsrfHeaderName: 'X-CSRF-Token',
  });
  return false;
};

type ResetPasswordMutationConfig = {
  param: FormData | URLSearchParams;
  request?: boolean;
};

export const useResetPassword = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ param, request }: ResetPasswordMutationConfig) => resetPassword(param, request),
    {
      onSuccess: (request) => {
        if (request) {
          setNotify({ severity: 'info', text: 'パスワードリセットリクエストを送信しました' });
        } else {
          setNotify({ severity: 'info', text: 'パスワードをリセットしました' });
        }
      },
      onError: () => {
        setNotify({ severity: 'error', text: '送信に失敗しました' });
      },
    },
  );
};
