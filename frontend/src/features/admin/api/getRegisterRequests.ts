import { myAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';

type RegisterRequest = {
  requests: {
    id: string;
    name: string;
    email: string;
    grade: string;
    created_at: string;
  }[];
};

export const getRegisterRequests = async () => {
  const res = await myAxiosGet<RegisterRequest>(`/admin/register-requests`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const useRegisterRequests = () => {
  return useQuery({
    queryKey: ['register-requests'],
    queryFn: async () => await getRegisterRequests(),
  });
};
