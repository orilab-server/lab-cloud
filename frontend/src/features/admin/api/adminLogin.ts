import { auth } from '@/shared/lib/firebase';
import { notifyState } from '@/shared/stores';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const adminLogin = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password)
    .then((u) => u)
    .catch((error) => error as Error);
  if (res instanceof Error) {
    throw res;
  }
  return res;
};

type AdminLoginMutation = {
  email: string;
  password: string;
};

export const useAdminLogin = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async (config: AdminLoginMutation) => await adminLogin(config.email, config.password),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: '管理者画面にログインしました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'ログインできませんでした' });
      },
    },
  );
};
