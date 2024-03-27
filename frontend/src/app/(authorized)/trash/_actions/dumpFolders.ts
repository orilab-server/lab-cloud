'use server';

import { myAuthAxiosPost } from '@/app/_shared/lib/axios';

export const dumpFolders = async (formData: FormData) => {
  await myAuthAxiosPost(`/home/trash/dirs/dump`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
