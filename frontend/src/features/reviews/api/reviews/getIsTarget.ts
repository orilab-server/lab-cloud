import { useUser } from '@/features/auth/api/getUser';
import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';

export const getIsReviewTarget = async (reviewId: string, userId: number | undefined) => {
  return await myAuthAxiosGet<{ isTarget: boolean }>(`/reviews/${reviewId}/is-target/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.data.isTarget);
};

export const useIsReviewTarget = (reviewId: string) => {
  const userQuery = useUser();
  return useQuery({
    queryKey: ['reviews', reviewId, userQuery.data],
    queryFn: async () => await getIsReviewTarget(reviewId, userQuery.data?.id),
  });
};
