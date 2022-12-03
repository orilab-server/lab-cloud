import { notifyState } from '@/shared/stores';
import { myAxiosPatch, myAxiosPost } from '@/shared/utils/axios';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const resetPassword = async (param: URLSearchParams, request?: boolean) => {
  if (request) {
    await myAxiosPost('user/reset-password/request', param, {
      xsrfHeaderName: 'X-CSRF-Token',
    });
    return true;
  }
  await myAxiosPatch('user/reset-password', param, {
    xsrfHeaderName: 'X-CSRF-Token',
  });
  return false;
};

type ResetPasswordMutationConfig = {
  param: URLSearchParams;
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
