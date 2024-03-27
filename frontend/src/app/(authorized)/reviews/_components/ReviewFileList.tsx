'use client';

import ContextMenu from '@/app/(authorized)/reviews/_components/ContextMenu';
import { useCtxMenu } from '@/app/(authorized)/reviews/_hooks/useCtxMenu';
import { ReviewFile } from '@/app/(authorized)/reviews/_types/review';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  reviewId: string;
  reviewFiles: ReviewFile[];
};

const ReviewFileList = ({ reviewId, reviewFiles }: Props) => {
  const router = useRouter();
  const [openAcc, setOpenAcc] = useState<string[]>([]);
  const { ctxMenuRef, showCtxMenu, onCtxMenu } = useCtxMenu();
  const fileGroups = Array.from(new Set(reviewFiles.map((r) => r.file_name))).reduce((n, p) => {
    return {
      ...n,
      [p]: reviewFiles
        .filter((r) => r.file_name === p)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    };
  }, {}) as { [k: string]: ReviewFile[] };

  const pathname = usePathname();

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
          <div key={top.id} ref={ctxMenuRef} className="relative">
            {nexts && (
              <button
                onClick={() =>
                  setOpenAcc((old) =>
                    old.includes(k) ? old.filter((o) => o !== k) : Array.from(new Set([...old, k])),
                  )
                }
                className={`absolute z-10 top-[2px] left-3 hover:text-gray-400 transform origin-center transition-all ${
                  openAcc.includes(k) ? 'rotate-90' : ''
                }`}
              >
                &gt;
              </button>
            )}
            <button
              onContextMenu={(e) => onCtxMenu(e, top.id)}
              onDoubleClick={() => router.push(`${pathname}/${top.id}`)}
              className={`relative w-full grid grid-cols-6 px-2 mx-2 py-1 text-left rounded-md items-center ${
                (i + 1) % 2 ? '' : 'bg-gray-200'
              } text-gray-800 hover:bg-blue-200`}
            >
              <div className="col-span-3 truncate text-sm pl-3">
                {top.file_name}
                <div className="badge badge-accent badge-outline mx-2">最新</div>
              </div>
              <div className="pl-2 truncate text-sm">{top.created_at}</div>
              <div className="pl-2 text-sm">{top.user_name}</div>
              <div className="pl-2 text-sm">{fileGroups[k].length}</div>
            </button>
            <div className={`${showCtxMenu && showCtxMenu === top.id ? '' : 'hidden'}`}>
              <ContextMenu reviewId={reviewId} fileId={top.id} />
            </div>
            {nexts &&
              openAcc.includes(k) &&
              nexts.map(({ id, file_name, created_at, user_name }, n_i) => {
                return (
                  <div key={id}>
                    <button
                      onContextMenu={(e) => onCtxMenu(e, id)}
                      onDoubleClick={() => router.push(`${pathname}/${id}`)}
                      className={`relative w-full grid grid-cols-6 px-2 mx-2 py-1 rounded-md items-center text-left ${
                        (n_i + 1) % 2 ? 'bg-gray-100' : ''
                      } text-gray-800 hover:bg-blue-100`}
                    >
                      <div className="col-span-3 truncate text-sm pl-3">{file_name}</div>
                      <div className="pl-2 truncate text-sm">{created_at}</div>
                      <div className="pl-2 text-sm">{user_name}</div>
                      <div className="pl-2 text-sm"></div>
                    </button>
                    <div className={`${showCtxMenu && showCtxMenu === id ? '' : 'hidden'}`}>
                      <ContextMenu reviewId={reviewId} fileId={id} />
                    </div>
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
};

export default ReviewFileList;
