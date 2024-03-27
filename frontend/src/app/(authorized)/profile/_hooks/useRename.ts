'use client';

import { rename } from '@/app/(authorized)/profile/_actions/rename';
import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

type RenameMutationConfig = {
  param: URLSearchParams;
};

export const useRename = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(async ({ param }: RenameMutationConfig) => rename(param), {
    onSuccess: () => {
      setNotify({ severity: 'info', text: '名前を変更しました' });
    },
    onError: () => {
      setNotify({ severity: 'error', text: '名前の変更に失敗しました' });
    },
  });
};
