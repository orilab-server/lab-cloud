import React, { useState } from 'react';
import { GrAdd } from 'react-icons/gr';
import { MdCreateNewFolder, MdDriveFolderUpload, MdUploadFile } from 'react-icons/md';

const FloatingButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-5 right-5">
      <div className="relative">
        {/* dials */}
        <div className="absolute bottom-[70px] left-1 grid grid-cols-1 gap-3">
          <div className="relative group">
            <button
              className={`w-${open ? '9' : '0'} h-${
                open ? '9' : '0'
              } transition-all ease-in-out bg-gray-800 hover:bg-gray-300 rounded-full flex items-center justify-center`}
            >
              <MdCreateNewFolder size={20} className="text-gray-400" />
            </button>
            <div className="hidden group-hover:block group absolute w-28 text-xs text-white rounded whitespace-nowrap bg-gray-700 py-2 pl-2 top-[2px] -left-[120px]">
              新規フォルダ作成
            </div>
          </div>
          <div className="relative group">
            <button
              className={`w-${open ? '9' : '0'} h-${
                open ? '9' : '0'
              } transition-all ease-in-out bg-gray-800 hover:bg-gray-300 rounded-full flex items-center justify-center`}
            >
              <MdUploadFile size={20} className="text-gray-400" />
            </button>
            <div className="hidden group-hover:block absolute w-28 text-xs text-white rounded whitespace-nowrap bg-gray-700 py-2 pl-2 top-[2px] -left-[120px]">
              ファイル追加
            </div>
          </div>
          <div className="relative group">
            <button
              className={`w-${open ? '9' : '0'} h-${
                open ? '9' : '0'
              } transition-all ease-in-out bg-gray-800 hover:bg-gray-300 rounded-full flex items-center justify-center`}
            >
              <MdDriveFolderUpload size={20} className="text-gray-400" />
            </button>
            <div className="hidden group-hover:block absolute w-28 text-xs text-white rounded whitespace-nowrap bg-gray-700 py-2 pl-2 top-[2px] -left-[120px]">
              フォルダ追加
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="w-12 h-12 rounded-full bg-blue-300 hover:bg-blue-400 flex items-center justify-center"
        >
          <GrAdd size={20} className={`transform transition-all ${open ? 'rotate-45' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(FloatingButton);
