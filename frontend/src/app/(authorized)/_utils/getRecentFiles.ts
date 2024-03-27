import { getWithAuth } from '@/app/_shared/lib/fetch';
import { RecentFile } from '../home/_types/recents';

export const getRecentFiles = async (count?: number) => {
  const res = await getWithAuth(`/home/recent-files?count=${count || 5}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = (await res.json()) as { recent_files: RecentFile[] };
  return json.recent_files;
};
