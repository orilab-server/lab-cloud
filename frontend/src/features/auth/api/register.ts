import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

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
  const queryClient = useQueryClient();
  return useMutation(async (config: RegisterMutationConfig) => register(config.params), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('user');
    },
  });
};
