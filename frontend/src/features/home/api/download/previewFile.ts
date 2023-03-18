import { myAuthAxiosGet } from '@/shared/lib/axios';
import { getMimeType } from '@/shared/utils/mime';
import { useEffect, useState } from 'react';

export const getPreviewFile = async (path: string, name: string) => {
  const blobData = await myAuthAxiosGet<Blob>(`/download?path=${path}&target=${name}&type=file`, {
    responseType: 'blob',
  }).then((res) => res.data);
  const asFile = new File([blobData], name, {
    type: getMimeType(name),
  });
  return URL.createObjectURL(asFile);
};

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
