'use client';

import { useEffect, useState } from 'react';
import { getPreviewFile } from '../_actions/previewDownloadFile';

export const usePreviewFile = (path: string, name: string) => {
  const [url, setUrl] = useState<string>('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (open) {
      getPreviewFile(path, name).then(async (res) => {
        setUrl(res);
      });
    }
    if (!open && url) {
      URL.revokeObjectURL(url);
      setUrl('');
    }
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
        setUrl('');
      }
    };
  }, [open]);

  return { url, open, handleOpen, handleClose };
};
