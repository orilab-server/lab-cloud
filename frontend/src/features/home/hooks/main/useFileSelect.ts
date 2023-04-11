import { sleep } from '@/shared/utils/sleep';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contextMenuState, selectedFilesState } from '../../modules/stores';
import { FileOrDir, StorageItem } from '../../types/storage';

export const useFileSelect = (fileList: StorageItem[]) => {
  const [selected, setSelected] = useRecoilState(selectedFilesState);
  const [dropped, setDropped] = useState<string>('');
  const contextMenu = useRecoilValue(contextMenuState);

  const one = (name: string) =>
    setSelected((old) =>
      old.has(name)
        ? Array.from(old).length > 1
          ? new Set([name])
          : new Set([])
        : new Set([name]),
    );
  const add = (name: string) => setSelected((old) => new Set([...Array.from(old), name]));
  const del = (name: string) =>
    setSelected((old) => new Set([...Array.from(old).filter((o) => o !== name)]));

  const onClickWithKey = (e: React.MouseEvent<HTMLDivElement>, name: string) => {
    if ('rename' in contextMenu) {
      one(contextMenu.rename!);
      return;
    }
    e.preventDefault();
    if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
      selected.has(name) ? del(name) : add(name);
    } else if (e.shiftKey) {
      setSelected((old) => {
        const index = fileList.findIndex((t) => t.name === name);
        const lastAddIndex = fileList.findIndex(
          (t) => t.name === (Array.from(old).at(-1) as string),
        );
        if (index >= lastAddIndex) {
          return new Set([
            ...Array.from(old),
            ...fileList.map((t) => t.name).slice(lastAddIndex, index + 1),
          ]);
        } else {
          return new Set([
            ...Array.from(old),
            ...fileList.map((t) => t.name).slice(index, lastAddIndex + 1),
          ]);
        }
      });
    } else {
      one(name);
    }
  };

  const dragStart = (name: string) => {
    if (Array.from(selected).length === 0) {
      setSelected(new Set([name]));
    }
  };

  const dropInFolder = async (name: string, type: FileOrDir) => {
    if (selected.has(name)) {
      return;
    }
    if (type === 'dir') {
      setDropped(name);
    }
    // ファイル移動ロジックをここに記述
    await sleep(1);
    setDropped('');
  };

  return { selected, add, onClickWithKey, dropped, dragStart, dropInFolder };
};
