import { User } from '@/app/_types/user';
import { Dir } from '../_types/storage';
import DownloadToasts from './DownloadToasts';
import FileList from './FileList';
import FilePreview from './FilePreview';

type Props = {
  dir: Dir;
  user: User;
};

export const HomeContents = ({ dir, user }: Props) => {
  return (
    <div>
      <FileList dir={dir} user={user} />
      <DownloadToasts />
      <FilePreview />
    </div>
  );
};
