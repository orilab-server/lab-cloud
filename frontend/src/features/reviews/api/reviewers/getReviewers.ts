import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Reviewer } from '../../types/review';
import { extractPathFromPathname } from '../../utils/url';

export const getReviewers = async (reviewId: string, fileId: string) => {
  return await myAuthAxiosGet<{ reviewers: Reviewer[] }>(
    `/reviews/${reviewId}/files/${fileId}/reviewers`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.data.reviewers);
};

export const useGetReviewers = () => {
  const router = useRouter();
  const reviewId = extractPathFromPathname(router.query.review_id as string, 1);
  const fileId = extractPathFromPathname(router.query.file_id as string, 2);

  return useQuery({
    queryKey: ['reviewers', fileId],
    queryFn: async () => getReviewers(reviewId, fileId),
  });
};
