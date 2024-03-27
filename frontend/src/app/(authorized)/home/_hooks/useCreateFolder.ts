'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { createFolder } from '../_actions/createFolder';

type CreateFolderMutationConfig = {
  path: string;
};

export const useCreateFolder = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(async ({ path }: CreateFolderMutationConfig) => await createFolder(path), {
    onSuccess: () => {
      setNotify({ severity: 'info', text: '作成しました' });
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
