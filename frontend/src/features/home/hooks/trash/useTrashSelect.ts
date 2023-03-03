import { useState } from 'react';
import { TrashItem } from '../../types/trash';

export const useTrashSelect = (fileList: TrashItem[]) => {
  const [selected, setSelected] = useState<Set<string>>(new Set([]));

  const one = (id: string) =>
    setSelected((old) =>
      old.has(id) ? (Array.from(old).length > 1 ? new Set([id]) : new Set([])) : new Set([id]),
    );
  const add = (id: string) => setSelected((old) => new Set([...Array.from(old), id]));
  const del = (id: string) =>
    setSelected((old) => new Set([...Array.from(old).filter((o) => o !== id)]));

  const onClickWithKey = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
      selected.has(id) ? del(id) : add(id);
    } else if (e.shiftKey) {
      setSelected((old) => {
        const index = fileList.findIndex((t) => t.id === id);
        const lastAddIndex = fileList.findIndex((t) => t.id === (Array.from(old).at(-1) as string));
        if (index >= lastAddIndex) {
          return new Set([
            ...Array.from(old),
            ...fileList.map((t) => t.id).slice(lastAddIndex, index + 1),
          ]);
        } else {
          return new Set([
            ...Array.from(old),
            ...fileList.map((t) => t.id).slice(index, lastAddIndex + 1),
          ]);
        }
      });
    } else {
      one(id);
    }
  };

  return { selected, add, onClickWithKey };
};
