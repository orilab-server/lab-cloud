'use server';

import { myAuthAxiosPost } from '@/app/_shared/lib/axios';

export const removeFromTrash = async (formData: FormData) => {
  await myAuthAxiosPost(`/home/trash/files/remove`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
