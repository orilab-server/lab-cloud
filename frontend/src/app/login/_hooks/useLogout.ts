'use client';

import { myAuthAxiosGet } from '@/app/_shared/lib/axios';
import { notifyState } from '@/app/_shared/stores';
import { sleep } from '@/app/_shared/utils/sleep';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const logout = async () => {
  const ok = window.confirm('ログアウトしますか？');
  return ok;
};

export const useLogout = () => {
  const router = useRouter();
  const setNotify = useSetRecoilState(notifyState);
  return useMutation(async () => logout(), {
    onSuccess: async (ok) => {
      if (ok) {
        await myAuthAxiosGet(`/logout`);
        setNotify({ severity: 'info', text: 'ログアウトしました' });
        document.cookie = 'mysession=;';
        await sleep(1);
        router.push('/login');
      }
    },
    onError: () => {
      setNotify({
        severity: 'error',
        text: 'エラーが発生しました',
      });
    },
  });
};
