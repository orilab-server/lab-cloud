import { auth } from '@/shared/lib/firebase';
import { notifyState } from '@/shared/stores';
import { signOut } from 'firebase/auth';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const adminLogout = async () => {
  const res = await signOut(auth).catch((error) => error as Error);
  if (res instanceof Error) {
    throw res;
  }
};

export const useAdminLogout = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(async () => await adminLogout(), {
    onSuccess: () => {
      setNotify({ severity: 'info', text: '管理者画面からログアウトしました' });
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'ログアウトに失敗しました' });
    },
  });
};
