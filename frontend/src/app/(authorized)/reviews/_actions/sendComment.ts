'use server';

import { myAuthAxiosPost } from '@/app/_shared/lib/axios';

export const sendComment = async (
  reviewId: string,
  fileId: string,
  index: number,
  formData: FormData,
) => {
  await myAuthAxiosPost(`/reviews/${reviewId}/files/${fileId}/comments/${index}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
