import { myAxiosGet } from '@/shared/utils/axios';
import { useQuery } from 'react-query';
import { Reviewer } from '../types/review';

export const getReviewers = async (url: string) => {
  const res = await myAxiosGet<{ reviewers: Reviewer[] }>(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.reviewers;
};

export const useGetReviewers = (url: string) => {
  return useQuery({
    queryKey: ['reviewers'],
    queryFn: async () => getReviewers(url),
  });
};
