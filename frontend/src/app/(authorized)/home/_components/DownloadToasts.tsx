'use client';

import { downloadProgressesState } from '@/app/(authorized)/home/_stores';
import { useRecoilValue } from 'recoil';

const DownloadToasts = () => {
  const progresses = useRecoilValue(downloadProgressesState);
  const uniqueProgresses = Array.from(new Map(progresses.map((p) => [p.name, p])).values());

  if (uniqueProgresses.length === 0) {
    return null;
  }

  return (
    <>
      <div className="toast toast-middle">
        <div className="indicator">
          <span className="indicator-item badge badge-primary">{progresses.length}</span>
          <div className="collapse collapse-arrow bg-gray-800 rounded-md">
            <input className="peer/check" type="checkbox" />
            <div className="collapse-title text-white flex items-center font-medium text-sm">
              Download List
            </div>
            <div className="collapse-content">
              {uniqueProgresses.map((p, i) => (
                <div key={p.name + i} className="flex items-center justify-between w-56 truncate">
                  <span className="text-white truncate w-40">{p.name}</span>
                  <div
                    className="ml-3 radial-progress text-gray-200"
                    style={{ '--value': p.progress, '--size': '1.3rem' } as any}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadToasts;
