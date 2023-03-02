import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';
import { RecentFile } from '../../types/recents';

export const getRecentFiles = async (count?: number) => {
  return await myAuthAxiosGet<{ recent_files: RecentFile[] }>(
    `/home/recent-files?count=${count || 5}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.data.recent_files);
};

export const useGetRecentFiles = (count?: number) => {
  return useQuery({ queryKey: [`recent-files`], queryFn: async () => await getRecentFiles(count) });
};
