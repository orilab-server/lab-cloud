'use server';

import { myAuthAxiosGet } from '@/app/_shared/lib/axios';

export const createFolder = async (path: string) => {
  await myAuthAxiosGet(`/request/mkdir?path=${path}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
