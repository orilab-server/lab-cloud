'use server';

import { myAuthAxiosPost } from '@/app/_shared/lib/axios';

export const createReview = async (formData: FormData) => {
  await myAuthAxiosPost('/reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
