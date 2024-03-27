'use client';

import { myAxiosPost } from '@/app/_shared/lib/axios';
import { notifyState } from '@/app/_shared/stores';
import { sleep } from '@/app/_shared/utils/sleep';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const login = async (email: string, password: string) => {
  const params = new FormData();
  params.append('email', email);
  params.append('password', password);
  await myAxiosPost(`/login`, params, {
    xsrfHeaderName: 'X-CSRF-Token',
  });
};

type LoginMutationConfig = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const router = useRouter();
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(async (config: LoginMutationConfig) => login(config.email, config.password), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: 'ログインしました' });
      await sleep(2);
      const localStoragePath = localStorage.getItem('path');
      const to = localStoragePath ? `/${localStoragePath}` : '/home';
      if (localStoragePath) {
        localStorage.removeItem('path');
      }
      router.push(to);
    },
    onError: () => {
      setNotify({
        severity: 'error',
        text: 'ログインできませんでした',
      });
    },
  });
};
