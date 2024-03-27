import RecentFileList from '@/app/(authorized)/recent/_components/RecentFileList';
import { getRecentFiles } from '../_utils/getRecentFiles';

const Page = async () => {
  const files = await getRecentFiles(50);

  return <RecentFileList files={files} />;
};

export default Page;
