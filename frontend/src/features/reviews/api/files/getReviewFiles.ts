import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';
import { ReviewFile } from '../../types/review';

export const getReviewFiles = async (reviewId: string) => {
  const res = await myAuthAxiosGet<{ files: ReviewFile[] }>(`/reviews/${reviewId}/files`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.files;
};

export const useGetReviewFiles = (reviewId: string) => {
  return useQuery({
    queryKey: ['review_files', reviewId],
    queryFn: async () => await getReviewFiles(reviewId),
  });
};
