'use server';

import { myAuthAxiosPost } from '@/app/_shared/lib/axios';

export const dumpFiles = async (formData: FormData) => {
  await myAuthAxiosPost(`/home/trash/files/dump`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
