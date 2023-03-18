import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';
import { Review } from '../../types/review';

export const getReviews = async () => {
  const res = await myAuthAxiosGet<{ reviews: Review[] }>('/reviews', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.reviews;
};

export const useGetReviews = () => {
  return useQuery({ queryKey: ['reviews'], queryFn: async () => await getReviews() });
};
