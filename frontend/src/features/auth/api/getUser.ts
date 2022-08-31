import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

type User = {
  is_login: boolean;
  name: string;
  is_temporary: boolean;
};

export const getUser = async () => {
  const res = await axios.get<any, AxiosResponse<User>>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/user`,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.data;
};

export const useUser = () => {
  return useQuery(['user'], getUser);
};
