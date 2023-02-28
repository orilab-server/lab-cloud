import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { reviewerState } from '../../modules/stores';
import { Comment } from '../../types/review';
import { extractPathFromPathname } from '../../utils/url';

export const getComment = async (
  reviewId: string,
  fileId: string,
  reviewerId: string,
  index: number,
) => {
  if (!reviewerId) {
    return null;
  }
  return await myAuthAxiosGet<{ comment: Comment }>(
    `/reviews/${reviewId}/files/${fileId}/reviewers/${reviewerId}/comments/${index}`,
  ).then((res) => (res.data ? res.data.comment : null));
};

export const useGetComment = (index: number) => {
  const router = useRouter();
  const reviewId = extractPathFromPathname(router.query.review_id as string, 1);
  const fileId = extractPathFromPathname(router.query.file_id as string, 2);
  const reviewer = useRecoilValue(reviewerState);

  return useQuery({
    queryKey: [`comment-${index}`, reviewer],
    queryFn: async () => await getComment(reviewId, fileId, reviewer, index),
  });
};
