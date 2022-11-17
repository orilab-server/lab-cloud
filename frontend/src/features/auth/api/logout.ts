import { notifyState } from '@/shared/stores';
import { sleep } from '@/shared/utils/sleep';
import axios from 'axios';
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
      console.log(ok);
      if (ok) {
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/home/logout`, {
          withCredentials: true,
        });
        setNotify({ severity: 'info', text: 'ログアウトしました' });
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
