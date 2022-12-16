import { myAxiosGet } from '@/shared/utils/axios';
import { useQuery } from 'react-query';
import { ReviewedFile } from '../types/review';

export const getReviewedFiles = async (reviewId: string, reviewedId: string) => {
  const res = await myAxiosGet<{ files: ReviewedFile[]; user_id: string }>(
    `home/reviews/${reviewId}/reviewed/${reviewedId}/files`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.data;
};

export const useGetReviewedFiles = (reviewId: string, reviewedId: string) => {
  return useQuery({
    queryKey: ['reviewed_files', reviewId, reviewedId],
    queryFn: async () => await getReviewedFiles(reviewId, reviewedId),
    staleTime: Infinity,
  });
};
