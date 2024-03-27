'use server';

import { myAuthAxiosPost } from '@/app/_shared/lib/axios';

export const uploadReviewFile = async (reviewId: string, formData: FormData) => {
  await myAuthAxiosPost(`/reviews/${reviewId}/files/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
