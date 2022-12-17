import { myAxiosGet } from '@/shared/utils/axios';
import { useQuery } from 'react-query';
import { Reviewed } from '../types/review';

export const getRevieweds = async (reviewId: string) => {
  if (!reviewId) {
    return [];
  }
  const res = await myAxiosGet<{ revieweds: Reviewed[] }>(`home/reviews/${reviewId}/reviewed/`);
  return res.data.revieweds;
};

export const useGetRevieweds = (reviewId: string) => {
  return useQuery({
    queryKey: ['revieweds', reviewId],
    queryFn: async () => await getRevieweds(reviewId),
    staleTime: Infinity,
  });
};