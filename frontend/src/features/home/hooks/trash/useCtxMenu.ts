import { useEffect, useRef, useState } from 'react';

export const useCtxMenu = () => {
  const [showCtxMenu, setShowCtxMenu] = useState<string | null>(null);
  const ctxMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ctxMenuRef.current;
    if (!el) return;
    const hundleClickOutside = (e: MouseEvent) => {
      if (!el?.contains(e.target as Node)) setShowCtxMenu(null);
    };
    document.addEventListener('click', hundleClickOutside);
    return () => {
      document.removeEventListener('click', hundleClickOutside);
    };
  }, [ctxMenuRef]);

  const onCtxMenu = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    setShowCtxMenu(id);
  };

  return { ctxMenuRef, showCtxMenu, setShowCtxMenu, onCtxMenu };
};
