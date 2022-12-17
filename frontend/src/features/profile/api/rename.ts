import { notifyState } from '@/shared/stores';
import { myAxiosPatch } from '@/shared/utils/axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const rename = async (param: URLSearchParams) =>
  await myAxiosPatch('home/user/rename', param, {
    xsrfHeaderName: 'X-CSRF-Token',
  });

type RenameMutationConfig = {
  param: URLSearchParams;
};

export const useRename = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(async ({ param }: RenameMutationConfig) => rename(param), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('user');
      setNotify({ severity: 'info', text: '名前を変更しました' });
    },
    onError: () => {
      setNotify({ severity: 'error', text: '名前の変更に失敗しました' });
    },
  });
};
