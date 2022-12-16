import { myAxiosGet } from '@/shared/utils/axios';
import { useQuery } from 'react-query';
import { Review } from '../types/review';

export const getReviews = async () => {
  const res = await myAxiosGet<{ reviews: Review[] }>('home/reviews/', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.reviews;
};

export const useGetReviews = () => {
  return useQuery({ queryKey: ['reviews'], queryFn: async () => await getReviews() });
};
