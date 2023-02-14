import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';
import { Comment } from '../types/review';

export const getComent = async (url: string) => {
  const res = await myAuthAxiosGet<{ comment: Comment }>(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.comment;
};

export const useGetComment = (url: string, reviewer: string) => {
  return useQuery({
    queryKey: ['comment', url, reviewer],
    queryFn: async () => getComent(url),
  });
};
