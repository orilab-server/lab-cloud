import { myAxiosPost } from '@/shared/utils/axios';
import { useMutation } from 'react-query';

export const requestRegister = async (formData: FormData) => {
  await myAxiosPost('register-requests', formData, {
    xsrfHeaderName: 'X-CSRF-Token',
  });
};

type RequestRegisterMutationConfig = {
  formData: FormData;
};

export const useRequestRegister = () => {
  return useMutation(
    async ({ formData }: RequestRegisterMutationConfig) => await requestRegister(formData),
  );
};
