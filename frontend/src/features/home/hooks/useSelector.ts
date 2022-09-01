import { SelectionEvent } from '@viselect/react';
import React, { useState } from 'react';

export const useSelector = () => {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const extractNames = (els: Element[]) =>
    els
      .map((el) => el.getAttribute('data-key'))
      .filter(Boolean)
      .map(String);

  const onStart = ({ event, selection, store }: SelectionEvent) => {
    if (!event?.ctrlKey && !event?.metaKey) {
      const storedTexts = store.stored.map((item: any) => item.outerText);
      const isClear = storedTexts.includes((event?.target as any).outerText);
      // 選択済みのアイテムをクリックした場合のみ全選択解除
      if (isClear) {
        selection.clearSelection();
        setSelected(() => new Set());
      }
    }
  };

  const onMove = ({
    store: {
      changed: { added, removed },
    },
  }: SelectionEvent) => {
    setSelected((prev) => {
      const next = new Set(prev);
      extractNames(added).forEach((name) => next.add(name));
      extractNames(removed).forEach((name) => next.delete(name));
      return next;
    });
  };

  const unSelect = () => {
    setSelected(() => new Set());
  };

  const onResetKeyDownEscape = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setSelected(() => new Set());
    }
  };

  return {
    selected,
    unSelect,
    onStart,
    onMove,
    onResetKeyDownEscape,
  };
};
