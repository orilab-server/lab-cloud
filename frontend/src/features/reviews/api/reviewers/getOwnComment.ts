import { useUser } from '@/features/auth/api/getUser';
import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Comment } from '../../types/review';
import { extractPathFromPathname } from '../../utils/url';

export const getOwnComment = async (
  reviewId: string,
  fileId: string,
  userId: number | undefined,
  index: number,
) => {
  if (!userId) {
    return null;
  }
  return await myAuthAxiosGet<{ comment: Comment }>(
    `/reviews/${reviewId}/files/${fileId}/own/${userId}/comments/${index}`,
  ).then((res) => (res.data ? res.data.comment : null));
};

export const useGetOwnComment = (index: number) => {
  const router = useRouter();
  const reviewId = extractPathFromPathname(router.query.review_id as string, 1);
  const fileId = extractPathFromPathname(router.query.file_id as string, 2);
  const userQuery = useUser();

  return useQuery({
    queryKey: [`comment-${index}`, userQuery.data],
    queryFn: async () => await getOwnComment(reviewId, fileId, userQuery.data?.id, index),
  });
};
