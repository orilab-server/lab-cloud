'use server';

import { myAuthAxiosDelete } from '@/app/_shared/lib/axios';

export const deleteReviewFile = async (reviewId: string, fileId: string) => {
  return await myAuthAxiosDelete(`/reviews/${reviewId}/files/${fileId}`);
};
