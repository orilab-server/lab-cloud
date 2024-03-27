'use client';

import { postWithApi } from '@/app/_shared/lib/fetch/api';
import { auth } from '@/app/_shared/lib/firebase';
import { notifyState } from '@/app/_shared/stores';
import { sleep } from '@/app/_shared/utils/sleep';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const adminLogout = async () => {
  const resFromFirebase = await signOut(auth).catch((error) => error as Error);
  if (resFromFirebase instanceof Error) {
    throw resFromFirebase;
  }
  const resFromServer = await postWithApi('/admin/logout');

  if (resFromServer.status !== 200) {
    throw new Error();
  }
};

export const useAdminLogout = () => {
  const router = useRouter();
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(async () => await adminLogout(), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: '管理者画面からログアウトしました' });
      await sleep(1);
      router.push('/admin/login');
    },
    onError: (e) => {
      console.log(e);
      setNotify({ severity: 'error', text: 'ログアウトに失敗しました' });
    },
  });
};
