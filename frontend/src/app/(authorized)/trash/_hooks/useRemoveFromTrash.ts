'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { removeFromTrash } from '../_actions/removeFromTrash';

type MvTrashRequestMutationConfig = {
  formData: FormData;
};

export const useRemoveFromTrash = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ formData }: MvTrashRequestMutationConfig) => removeFromTrash(formData),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'ゴミ箱から削除しました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
