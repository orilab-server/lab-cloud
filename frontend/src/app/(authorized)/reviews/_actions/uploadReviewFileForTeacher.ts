'use server';

import { myAuthAxiosPost } from '@/app/_shared/lib/axios';

export const uploadFileToTeacher = async (
  reviewId: string,
  reviewedId: string,
  formData: FormData,
) => {
  await myAuthAxiosPost(
    `/reviews/${reviewId}/reviewed/${reviewedId}/teacher/files/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};
