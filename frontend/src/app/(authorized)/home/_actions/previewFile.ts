'use server';

import { getWithAuth } from '@/app/_shared/lib/fetch';
import { getMimeType } from '@/app/_shared/utils/mime';
import { endFilenameSlicer } from '@/app/_shared/utils/slice';

export const getPreviewFile = async (path: string) => {
  if (!path) {
    return '';
  }
  const name = endFilenameSlicer(path);
  const res = await getWithAuth(`/download/file?path=${path}&target=${name}&type=file`);
  const blob = await res.blob();
  const asFile = new File([blob], name, {
    type: getMimeType(name),
  });
  return { url: URL.createObjectURL(asFile), fileName: name };
};
