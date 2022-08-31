import { isLoginState, userNameState } from '@/stores';
import { sleep } from '@/utils/sleep';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const logout = async () => {
  const ok = window.confirm('ログアウトしますか？');
  if (ok) {
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/home/logout`, {
      withCredentials: true,
    });
  }
};

export const useLogout = () => {
  const router = useRouter();
  const setIsLogin = useSetRecoilState(isLoginState);
  const setUserName = useSetRecoilState(userNameState);
  return useMutation(async () => logout(), {
    onSuccess: async () => {
      document.cookie = 'mysession=;';
      setIsLogin(false);
      setUserName(null);
      await sleep(1);
      await router.push('/login');
    },
  });
};
