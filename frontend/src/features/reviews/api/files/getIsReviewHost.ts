import { useUser } from '@/features/auth/api/getUser';
import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { extractPathFromPathname } from '../../utils/url';

export const getIsReviewHost = async (reviewId: string, fileId: string, userId?: number) => {
  if (!userId) {
    return null;
  }
  return await myAuthAxiosGet<{ isHost: boolean }>(
    `/reviews/${reviewId}/files/${fileId}/is-host/${userId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.data.isHost);
};

export const useIsReviewHost = () => {
  const router = useRouter();
  const reviewId = extractPathFromPathname(router.query.review_id as string, 1);
  const fileId = extractPathFromPathname(router.query.file_id as string, 2);
  const userQuery = useUser();

  return useQuery({
    queryKey: ['review_file', userQuery.data],
    queryFn: async () => await getIsReviewHost(reviewId, fileId, userQuery.data?.id),
  });
};
