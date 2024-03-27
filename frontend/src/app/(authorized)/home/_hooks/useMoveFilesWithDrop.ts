'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectedFilesState } from '../_stores';
import { FileOrDir } from '../_types/storage';
import { useMoveFiles } from './useMoveFiles';

export const useMoveFilesWithDrop = () => {
  const searchParams = useSearchParams();
  const paramPath = searchParams.get('path');
  const [selected, setSelected] = useRecoilState(selectedFilesState);
  const { moveFilesMutation, moveFilesToHigherMutation } = useMoveFiles();

  const dragStart = (name: string) => {
    if (Array.from(selected).length === 0) {
      setSelected(new Set([name]));
    }
  };

  const dropInFolder = async (toFolder: string, type: FileOrDir) => {
    setDroppable('');
    if (selected.has(toFolder) || type !== 'dir') {
      return;
    }
    // ファイル移動ロジックを以下に記述
    const targetPaths = Array.from(selected).join('/');
    await moveFilesMutation.mutateAsync({
      path: `/${paramPath || ''}`.replaceAll('//', '/'),
      targetPaths,
      toFolder,
    });
    setSelected(new Set([]));
  };

  // 現在の位置よりも上の階層にフォルダを移動する
  const dropInHigherFolder = async (toFolder: string) => {
    setDroppable('');
    const targetPaths = Array.from(selected).join('/');
    const queryPaths = `/${paramPath || ''}`.split('/').filter((p) => p);
    if (queryPaths[queryPaths.length - 1] === toFolder) {
      return;
    }
    const sliceIndex = queryPaths.findLastIndex((p) => p === toFolder) + 1;
    const path = toFolder === '/' ? '/' : `/${queryPaths.slice(0, sliceIndex).join('/')}`;
    await moveFilesToHigherMutation.mutateAsync({
      path,
      targetPaths,
      fromFolder: `/${paramPath || ''}`.replaceAll('//', '/'),
    });
    setSelected(new Set([]));
  };

  const [droppable, setDroppable] = useState<string>('');
  const saveDroppableDir = (name: string, type: FileOrDir) => {
    if (type === 'dir' && !selected.has(name)) {
      setDroppable(name);
    } else {
      setDroppable('');
    }
  };
  const resetDroppable = () => setDroppable('');

  return {
    droppable,
    moveFilesMutation,
    dragStart,
    dropInFolder,
    dropInHigherFolder,
    saveDroppableDir,
    resetDroppable,
  };
};
