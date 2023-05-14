import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useMoveFiles } from '../../api/main/moveFiles';
import { selectedFilesState } from '../../modules/stores';
import { FileOrDir } from '../../types/storage';

export const useMoveFilesWithDrop = () => {
  const router = useRouter();
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
      path: `/${(router.query.path as string) || ''}`.replaceAll('//', '/'),
      targetPaths,
      toFolder,
    });
    setSelected(new Set([]));
  };

  // 現在の位置よりも上の階層にフォルダを移動する
  const dropInHigherFolder = async (toFolder: string) => {
    setDroppable('');
    const targetPaths = Array.from(selected).join('/');
    const queryPaths = `/${(router.query.path as string) || ''}`.split('/').filter((p) => p);
    if (queryPaths[queryPaths.length - 1] === toFolder) {
      return;
    }
    const sliceIndex = queryPaths.findLastIndex((p) => p === toFolder) + 1;
    const path = toFolder === '/' ? '/' : `/${queryPaths.slice(0, sliceIndex).join('/')}`;
    await moveFilesToHigherMutation.mutateAsync({
      path,
      targetPaths,
      fromFolder: `/${(router.query.path as string) || ''}`.replaceAll('//', '/'),
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
