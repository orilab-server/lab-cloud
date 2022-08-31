import { useState } from 'react';

export const useSelector = () => {
  const [selects, setSelects] = useState<{ name: string; type: 'dir' | 'file' }[]>([]);
  const [keyDown, setKeyDown] = useState<boolean>(false);

  const clickListItem = (name: string, type: 'dir' | 'file') => {
    setSelects((old) => {
      if (!keyDown) {
        return [];
      }
      if (old.some((item) => item.name === name)) {
        return old.filter((item) => item.name !== name);
      }
      return [...old, { name, type }];
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setSelects([]);
      return;
    }
    if (event.key === 'Meta' || event.key === 'Shift') {
      setKeyDown(true);
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Meta' || event.key === 'Shift') {
      setKeyDown(false);
    }
  };

  const unSelect = () => {
    setSelects([]);
  };

  return { selects, unSelect, clickListItem, onKeyDown, onKeyUp };
};
