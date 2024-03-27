'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { restoreFromTrash } from '../_actions/restoreFromTrash';

type MvTrashRequestMutationConfig = {
  formData: FormData;
};

export const useRestoreFromTrash = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ formData }: MvTrashRequestMutationConfig) => restoreFromTrash(formData),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: '元の場所に戻しました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
