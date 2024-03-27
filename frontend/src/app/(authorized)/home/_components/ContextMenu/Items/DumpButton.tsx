'use client';

import { FileNode } from '@/app/(authorized)/home/_types/storage';
import { useDumpFiles } from '@/app/(authorized)/trash/_hooks/useDumpFiles';
import { useDumpFolders } from '@/app/(authorized)/trash/_hooks/useDumpFolders';
import { User } from '@/app/_types/user';
import { useSearchParams } from 'next/navigation';

type DumpButtonProps = {
  selected: Set<string>;
  fileNodes: FileNode[];
  user: User;
};

const DumpButton = ({ selected, fileNodes, user }: DumpButtonProps) => {
  const searchParams = useSearchParams();
  const path = searchParams.get('path');
  const dumpFoldersMutation = useDumpFolders();
  const dumpFilesMutation = useDumpFiles();

  const dump = () => {
    const files = fileNodes
      .filter((f) => f.type === 'file' && selected.has(f.name))
      .map((f) => `${path || ''}/${f.name}`);
    const folders = fileNodes
      .filter((f) => f.type === 'dir' && selected.has(f.name))
      .map((f) => `${path || ''}/${f.name}`);
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
      dumpFoldersMutation.mutate({ formData });
    }
  };

  return (
    <button onClick={dump} className="text-white hover:bg-gray-700 px-3 py-1">
      ゴミ箱に移動
    </button>
  );
};

export default DumpButton;
