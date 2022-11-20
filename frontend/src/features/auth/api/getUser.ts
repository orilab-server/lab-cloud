import { myAxiosGet } from '@/shared/utils/axios';
import { useQuery } from 'react-query';

type User = {
  is_login: boolean;
  name: string;
  is_temporary: boolean;
};

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
