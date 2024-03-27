'use server';

import { myAuthAxiosPost } from '@/app/_shared/lib/axios';

export const restoreFromTrash = async (formData: FormData) => {
  await myAuthAxiosPost(`/home/trash/files/restore`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
