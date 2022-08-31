import { sleep } from '@/utils/sleep';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';

export const Login = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);
  const loginPost = axios.create({
    xsrfHeaderName: 'X-CSRF-Token',
    withCredentials: true,
  });
  await loginPost.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, params);
};

type LoginMutationConfig = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const router = useRouter();
  return useMutation(async (config: LoginMutationConfig) => Login(config.email, config.password), {
    onSuccess: async () => {
      await sleep(2);
      await router.push('/');
    },
  });
};
