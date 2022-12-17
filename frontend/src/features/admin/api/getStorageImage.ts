import { getImage } from '@/shared/lib/firebase';
import { useQuery } from 'react-query';

export const getStorageImage = async (bucket: string, name: string) => {
  const blob = await getImage(bucket, name);
  return URL.createObjectURL(blob);
};

export const useStorageImage = (bucket: string, name: string) => {
  return useQuery({
    queryKey: ['firebase-storage', { bucket, name }],
    queryFn: async () => getStorageImage(bucket, name),
  });
};
