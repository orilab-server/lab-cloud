import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';
import { TrashItem } from '../../types/trash';

export const getTrashItems = async () => {
  const res = await myAuthAxiosGet<{ trashItems: TrashItem[] }>('/home/trash', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.trashItems;
};

export const useGetTrashItems = () => {
  return useQuery({ queryKey: ['trash'], queryFn: async () => getTrashItems() });
};
