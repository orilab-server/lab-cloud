import { useDownload } from '@/features/home/api/main/download';
import { StorageContext } from '@/features/home/modules/contetexts/storage';
import { downloadProgressesState } from '@/features/home/modules/stores';
import { sleep } from '@/shared/utils/sleep';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useSetRecoilState } from 'recoil';

type DLButtonProps = {
  selected: Set<string>;
};

const DLButton = ({ selected }: DLButtonProps) => {
  const router = useRouter();
  const storageItems = useContext(StorageContext)?.fileNames || [];
  const setProgresses = useSetRecoilState(downloadProgressesState);
  const downloadMutation = useDownload();

  const onDownload = async () => {
    setProgresses(
      storageItems
        .filter((s) => selected.has(s.name))
        .map((s) => ({
          name: s.name,
          path: (router.query.path as string) || '',
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
