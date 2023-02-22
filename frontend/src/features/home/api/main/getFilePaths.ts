import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { StorageItem } from '../../types/storage';

export const getFilePaths = async (paramPath: string | null) => {
  const res = await myAuthAxiosGet<{ fileNames: StorageItem[]; important: boolean }>(
    `/home/?path=${paramPath || '/'}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const { fileNames, important } = res.data;
  if (!fileNames) {
    return {
      fileNames: [],
      important,
    };
  }
  return {
    fileNames,
    important,
  };
};

export const useFilePaths = () => {
  const router = useRouter();
  const queryPath = router.query.path;
  return useQuery({
    queryKey: ['storage', { queryPath }],
    queryFn: async () => getFilePaths((queryPath as string) || ''),
  });
};
