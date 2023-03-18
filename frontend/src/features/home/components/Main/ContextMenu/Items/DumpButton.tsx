import { UserContext } from '@/features/auth/modules/contexts/user';
import { useDumpFiles } from '@/features/home/api/trash/dumpFiles';
import { useDumpFolders } from '@/features/home/api/trash/dumpFolders';
import { StorageContext } from '@/features/home/modules/contetexts/storage';
import { useRouter } from 'next/router';
import { useContext } from 'react';

type DumpButtonProps = {
  selected: Set<string>;
};

const DumpButton = ({ selected }: DumpButtonProps) => {
  const router = useRouter();
  const user = useContext(UserContext);
  const storageItems = useContext(StorageContext)?.fileNames || [];
  const dumFoldersMutation = useDumpFolders();
  const dumpFilesMutation = useDumpFiles();

  const dump = () => {
    if (!user?.id) {
      return;
    }
    const files = storageItems
      .filter((f) => f.type === 'file' && selected.has(f.name))
      .map((f) => `${router.query.path || ''}/${f.name}`);
    const folders = storageItems
      .filter((f) => f.type === 'dir' && selected.has(f.name))
      .map((f) => `${router.query.path || ''}/${f.name}`);
    if (files.length > 0) {
      const formData = new FormData();
      formData.append('filePaths', files.join('///'));
      formData.append('userId', user.id.toString());
      dumpFilesMutation.mutate({ formData });
    }
    if (folders.length > 0) {
      const formData = new FormData();
      formData.append('dirPaths', folders.join('///'));
      formData.append('userId', user.id.toString());
      dumFoldersMutation.mutate({ formData });
    }
  };

  return (
    <button onClick={dump} className="text-white hover:bg-gray-700 px-3 py-1">
      ゴミ箱に移動
    </button>
  );
};

export default DumpButton;
