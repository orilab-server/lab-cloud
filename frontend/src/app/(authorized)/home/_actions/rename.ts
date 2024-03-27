'use server';

import { myAuthAxiosGet } from '@/app/_shared/lib/axios';

export const rename = async (path: string, oldName: string, newName: string) => {
  await myAuthAxiosGet(`/request/rename?path=${path}&oldName=${oldName}&newName=${newName}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
