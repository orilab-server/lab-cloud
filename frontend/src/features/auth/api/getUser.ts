import { myAxiosGet } from '@/shared/utils/axios';
import { useQuery } from 'react-query';
import { User } from '../types/user';

export const getUser = async () => {
  const res = await myAxiosGet<User>(`user`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const useUser = () => {
  return useQuery(['user'], getUser);
};
