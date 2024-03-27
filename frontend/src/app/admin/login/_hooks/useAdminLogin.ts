'use client';

import { postWithApi } from '@/app/_shared/lib/fetch/api';
import { auth } from '@/app/_shared/lib/firebase';
import { notifyState } from '@/app/_shared/stores';
import { sleep } from '@/app/_shared/utils/sleep';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const adminLogin = async (email: string, password: string) => {
  // firebaseにログインしてユーザークレデンシャルを取得
  const resFromFirebase = await signInWithEmailAndPassword(auth, email, password)
    .then((u) => u)
    .catch((error) => error as Error);
  if (resFromFirebase instanceof Error) {
    throw resFromFirebase;
  }
  const idToken = await resFromFirebase.user.getIdToken();
  const resFromServer = await postWithApi('/admin/login', {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (resFromServer.status !== 200) {
    throw new Error();
  }
};

type AdminLoginMutation = {
  email: string;
  password: string;
};

export const useAdminLogin = () => {
  const router = useRouter();
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async (config: AdminLoginMutation) => await adminLogin(config.email, config.password),
    {
      onSuccess: async () => {
        setNotify({ severity: 'info', text: '管理者画面にログインしました' });
        await sleep(1);
        router.push('/admin');
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'ログインできませんでした' });
      },
    },
  );
};
