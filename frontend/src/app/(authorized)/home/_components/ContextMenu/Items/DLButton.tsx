'use client';

import { useDownload } from '@/app/(authorized)/home/_hooks/useDownload';
import { downloadProgressesState } from '@/app/(authorized)/home/_stores';
import { FileNode } from '@/app/(authorized)/home/_types/storage';
import { sleep } from '@/app/_shared/utils/sleep';
import { useSearchParams } from 'next/navigation';
import { useSetRecoilState } from 'recoil';

type DLButtonProps = {
  selected: Set<string>;
  fileNodes: FileNode[];
};

const DLButton = ({ selected, fileNodes }: DLButtonProps) => {
  const searchParams = useSearchParams();
  const setProgresses = useSetRecoilState(downloadProgressesState);
  const downloadMutation = useDownload();

  const onDownload = async () => {
    setProgresses(
      fileNodes
        .filter((s) => selected.has(s.name))
        .map((s) => ({
          name: s.name,
          path: searchParams.get('path') || '',
          type: s.type,
          progress: 0,
          status: 'pending' as 'pending',
        })),
    );
    await sleep(2);
    await downloadMutation.mutateAsync();
  };

  return (
    <button onClick={onDownload} className="text-white hover:bg-gray-700 px-3 py-1">
      ダウンロード
    </button>
  );
};

export default DLButton;
