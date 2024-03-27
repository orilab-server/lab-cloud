'use server';

import { myAuthAxiosGet } from '@/app/_shared/lib/axios';

export const shareComment = async (reviewId: string, fileId: string, userId: number) => {
  await myAuthAxiosGet(`/reviews/${reviewId}/files/${fileId}/own/${userId}/comments/share`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
