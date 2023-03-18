import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';
import { User } from '../types/user';

export const getUsers = async () => {
  const res = await myAuthAxiosGet<{ users: User[] }>('/users', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.users;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['storage', 'users'],
    queryFn: async () => await getUsers(),
    staleTime: Infinity,
  });
};
