import { myAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const acceptRegisterRequests = async (formData: FormData[]) => {
  await Promise.all(
    formData.map(async (f) => {
      return await myAxiosPost('/admin/accept-register', f, {
        xsrfHeaderName: 'X-CSRF-Token',
      });
    }),
  );
};

type AcceptRegisterRequestsMutationConfig = {
  formData: FormData[];
};

export const useAcceptRegisterRequests = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ formData }: AcceptRegisterRequestsMutationConfig) => acceptRegisterRequests(formData),
    {
      onSuccess: async () => {
        setNotify({ severity: 'info', text: '承認しました。' });
        await queryClient.invalidateQueries('register-requests');
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: '承認に失敗しました。' });
      },
    },
  );
};
