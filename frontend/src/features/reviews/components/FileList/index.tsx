import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useGetReviewFiles } from '../../api/files/getReviewFiles';
import { ReviewFile } from '../../types/review';

const FileList = () => {
  const router = useRouter();
  const [openAcc, setOpenAcc] = useState<string[]>([]);
  const reviewId = ((id: string) =>
    id ? id : location.pathname.slice(location.pathname.lastIndexOf('/') + 1))(
    router.query.review_id as string,
  );
  const reviewFilesQuery = useGetReviewFiles(reviewId);
  const reviewFiles = reviewFilesQuery.data || [];
  const reviewName = router.query.review_name as string;
  const fileGroups = Array.from(new Set(reviewFiles.map((r) => r.file_name))).reduce((n, p) => {
    return {
      ...n,
      [p]: reviewFiles
        .filter((r) => r.file_name === p)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    };
  }, {}) as { [k: string]: ReviewFile[] };
  const filePageOpt = (fileId: string, fileName: string) => ({
    pathname: '/reviews/[review_id]/[file_id]',
    query: {
      review_id: reviewId,
      file_id: fileId,
      file_name: fileName,
      review_name: reviewName,
    },
  });

  return (
    <>
      <div className="fixed grid grid-cols-6 w-[calc(100vw_-_16rem)] min-w-[800px] z-[2] px-2 py-1 divide-x border-b top-14 bg-white">
        <div className="col-span-3 pl-2">名前</div>
        <div className="pl-2">追加日</div>
        <div className="pl-2">作者</div>
        <div className="pl-2">更新回数</div>
      </div>
      <div className="pt-9"></div>
      {Object.entries(fileGroups).map(([k, v], i) => {
        const top = v[0];
        const nexts = v.length > 1 ? v.slice(1) : null;
        return (
          <div key={top.id} className="relative">
            {nexts && (
              <button
                onClick={() =>
                  setOpenAcc((old) =>
                    old.includes(k) ? old.filter((o) => o !== k) : Array.from(new Set([...old, k])),
                  )
                }
                className={`absolute z-10 left-3 hover:text-gray-400 transform transition-all ${
                  openAcc.includes(k) ? 'rotate-90' : ''
                }`}
              >
                {'>'}
              </button>
            )}
            <Link href={filePageOpt(top.id, top.file_name)}>
              <a
                className={`relative w-full grid grid-cols-6 px-2 mx-2 py-1 text-left rounded-md items-center ${
                  (i + 1) % 2 ? '' : 'bg-gray-200'
                } text-gray-800`}
              >
                <div className="col-span-3 truncate text-sm pl-3">
                  {top.file_name}
                  <div className="badge badge-accent badge-outline mx-2">最新</div>
                </div>
                <div className="pl-2 truncate text-sm">{top.created_at}</div>
                <div className="pl-2 text-sm">{top.user_name}</div>
                <div className="pl-2 text-sm">{fileGroups[k].length}</div>
              </a>
            </Link>
            {nexts &&
              openAcc.includes(k) &&
              nexts.map((n, n_i) => {
                return (
                  <Link key={n.id} href={filePageOpt(n.id, n.file_name)}>
                    <a
                      className={`relative w-full grid grid-cols-6 px-2 mx-2 py-1 rounded-md items-center text-left ${
                        (n_i + 1) % 2 ? 'bg-gray-100' : ''
                      } text-gray-800`}
                    >
                      <div className="col-span-3 truncate text-sm pl-3">{n.file_name}</div>
                      <div className="pl-2 truncate text-sm">{n.created_at}</div>
                      <div className="pl-2 text-sm">{n.user_name}</div>
                      <div className="pl-2 text-sm"></div>
                    </a>
                  </Link>
                );
              })}
          </div>
        );
      })}
    </>
  );
};

export default FileList;
