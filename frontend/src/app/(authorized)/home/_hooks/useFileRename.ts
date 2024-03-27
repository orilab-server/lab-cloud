'use client';

import { notifyState } from '@/app/_shared/stores';
import { extractDateInStr } from '@/app/_shared/utils/slice';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { rename } from '../_actions/rename';
import { contextMenuState } from '../_stores';

export const useFileRename = () => {
  const searchParams = useSearchParams();
  const renameMutation = useRename();
  const setContextMenu = useSetRecoilState(contextMenuState);

  const rename = async (name: string, oldName: string) => {
    const [, createdAt] = extractDateInStr(oldName);
    const newName = createdAt
      ? !Array.from(oldName).includes('.')
        ? `${name}_${createdAt}`
        : `${name}_${createdAt}${oldName.slice(oldName.indexOf('.'))}`
      : name;
    await renameMutation.mutateAsync({
      path: `/${searchParams.get('path') || ''}`.replaceAll('//', '/'),
      oldName,
      newName,
    });
    setContextMenu({});
  };

  const renameCancel = () => setContextMenu({});

  return { rename, renameCancel };
};

type RenameRequestMutationConfig = {
  path: string;
  oldName: string;
  newName: string;
};

const useRename = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ path, oldName, newName }: RenameRequestMutationConfig) =>
      rename(path, oldName, newName),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: '名前を変更しました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
