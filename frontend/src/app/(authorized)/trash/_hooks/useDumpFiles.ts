'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { dumpFiles } from '../_actions/dumpFiles';

type DumpFilesRequestMutationConfig = {
  formData: FormData;
};

export const useDumpFiles = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(async ({ formData }: DumpFilesRequestMutationConfig) => dumpFiles(formData), {
    onSuccess: () => {
      setNotify({ severity: 'info', text: 'ゴミ箱に移動しました' });
    },
    onError: () => {
      setNotify({ severity: 'error', text: 'エラーが発生しました' });
    },
  });
};
