import { isTemporaryState } from '@/stores';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const register = async (params: URLSearchParams) => {
  const signupPost = axios.create({
    xsrfHeaderName: 'X-CSRF-Token',
    withCredentials: true,
  });
  await signupPost.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/home/user`, params);
};

type RegisterMutationConfig = {
  params: URLSearchParams;
};

export const useRegister = () => {
  const router = useRouter();
  const setIsTemporary = useSetRecoilState(isTemporaryState);
  const queryClient = useQueryClient();
  return useMutation(async (config: RegisterMutationConfig) => register(config.params), {
    onSuccess: async () => {
      setIsTemporary(false);
      await queryClient.invalidateQueries('user');
    },
  });
};
