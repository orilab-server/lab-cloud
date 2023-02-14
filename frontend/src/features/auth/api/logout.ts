import { myAuthAxiosGet } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { sleep } from '@/shared/utils/sleep';
import { useRouter } from 'next/router';
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
        localStorage.removeItem('logged_in');
        document.cookie = 'mysession=;';
        await sleep(1);
        await router.push('/login');
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
