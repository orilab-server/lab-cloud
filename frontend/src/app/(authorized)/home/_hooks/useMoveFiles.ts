'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { moveFiles, moveFilesToHiger } from '../_actions/moveFiles';
import { MoveFilesMutationConfig, MoveFilesToHigherMutationConfig } from '../_types/moveFile';

export const useMoveFiles = () => {
  const setNotify = useSetRecoilState(notifyState);

  return {
    moveFilesMutation: useMutation({
      mutationFn: (config: MoveFilesMutationConfig) => moveFiles(config),
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'ファイルを移動しました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'ファイルの移動に失敗しました' });
      },
    }),
    moveFilesToHigherMutation: useMutation({
      mutationFn: (config: MoveFilesToHigherMutationConfig) => moveFilesToHiger(config),
      onSuccess: async () => {
        setNotify({ severity: 'info', text: 'ファイルを移動しました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'ファイルの移動に失敗しました' });
      },
    }),
  };
};
