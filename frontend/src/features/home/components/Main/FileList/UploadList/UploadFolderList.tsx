import { folderUploadProgressesState } from '@/features/home/modules/stores';
import { AiFillFolder } from 'react-icons/ai';
import { useRecoilState } from 'recoil';

const UploadFolderList = () => {
  const [progresses, setProgresses] = useRecoilState(folderUploadProgressesState);
  const displayProgresses = Array.from(new Map(progresses.map((p) => [p.name, p])).values());

  return (
    <>
      {displayProgresses.length > 0 &&
        displayProgresses.map((item) => (
          <div
            key={item.name}
            className={`relative z-0 grid grid-cols-6 px-2 mx-2 py-1 rounded-md bg-gray-200 cursor-pointer`}
          >
            <div className="col-span-3 flex items-center">
              <AiFillFolder className="mr-2 text-gray-600" />
              <div className="flex items-center text-gray-400">
                <div>{item.name}</div>
                <div
                  className="ml-3 radial-progress text-gray-600"
                  style={{ '--value': item.progress, '--size': '1rem' } as any}
                ></div>
              </div>
            </div>
            <div className="pl-3"></div>
            <div className="pl-3"></div>
          </div>
        ))}
    </>
  );
};

export default UploadFolderList;
