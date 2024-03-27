'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { dumpFolders } from '../_actions/dumpFolders';

type DumpFoldersRequestMutationConfig = {
  formData: FormData;
};

export const useDumpFolders = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ formData }: DumpFoldersRequestMutationConfig) => dumpFolders(formData),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'ゴミ箱に移動しました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
