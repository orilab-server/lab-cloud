import { notifyState } from '@/shared/stores';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export const NotifyBar = () => {
  const [open, setOpen] = useState(false);
  const notify = useRecoilValue(notifyState);

  useEffect(() => {
    if (notify !== null) {
      setOpen(true);
    }

    const hideTimer = setTimeout(() => setOpen(false), 6000);
    return () => {
      clearTimeout(hideTimer);
    };
  }, [notify]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className={`z-[9999] toast toast-start max-w-xl transition-all ${
          open ? 'scale-100' : 'scale-0'
        }`}
      >
        <div className={`alert alert-${notify?.severity}`}>
          <span className="truncate font-semibold text-gray-600">{notify?.text}</span>
          <div>
            <button onClick={handleClose} className="text-xl p-1">
              ×
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
