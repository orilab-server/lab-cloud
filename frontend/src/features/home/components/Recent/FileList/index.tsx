import { useGetRecentFiles } from '@/features/home/api/recents/getRecentFiles';
import { useRouter } from 'next/router';

const FileList = () => {
  const router = useRouter();
  const recentFilesQuery = useGetRecentFiles(50);
  const files = recentFilesQuery.data || [];

  const moveDir = async (path: string) => {
    await router.push(`/home/?path=${path}`);
  };

  const moveToReview = async (path: string) => {
    await router.push(`/reviews/${path}`);
  };

  return (
    <>
      <div className="fixed grid grid-cols-6 w-[calc(100vw_-_16rem)] min-w-[800px] z-[2] px-2 py-1 divide-x border-b top-14 bg-white">
        <div className="col-span-3 pl-2">名前</div>
        <div className="pl-2">サイズ</div>
        <div className="pl-2">種類</div>
        <div className="pl-2">追加日</div>
      </div>
      <div className="pt-9"></div>
      {files.map((f, i) => {
        const nameArray = Array.from(f.file_name);
        const fileType =
          nameArray[0] !== '.' && nameArray.includes('.')
            ? `${f.file_name.slice(f.file_name.lastIndexOf('.') + 1)}ファイル`
            : '-';

        return (
          <div
            key={f.id}
            onDoubleClick={() =>
              f.type === 'review' ? moveToReview(f.location) : moveDir(f.location)
            }
            className={`relative grid grid-cols-6 px-2 mx-2 py-1 rounded-md ${
              (i + 1) % 2 ? '' : 'bg-gray-200'
            } cursor-pointer text-gray-800`}
          >
            <div className="col-span-3 flex items-center">{f.file_name}</div>
            <div className="pl-3 text-sm flex items-center">--</div>
            <div className="pl-3 truncate text-sm flex items-center">
              {f.type === 'dir' ? 'フォルダ' : f.type === 'file' ? fileType : 'レビュー'}
            </div>
            <div className="pl-3 text-sm">{f.created_at}</div>
          </div>
        );
      })}
    </>
  );
};

export default FileList;
