'use server';

import { getWithAuth } from '@/app/_shared/lib/fetch';
import { getMimeType } from '@/app/_shared/utils/mime';

export const getPreviewFile = async (path: string, name: string) => {
  const res = await getWithAuth(`/download?path=${path}&target=${name}&type=file`);
  const blob = await res.blob();
  const asFile = new File([blob], name, {
    type: getMimeType(name),
  });
  return URL.createObjectURL(asFile);
};
