'use client';

import React, { useState } from 'react';
import { GrAdd } from 'react-icons/gr';
import AddFileButton from './Children/AddFileButton';
import AddFolderButton from './Children/AddFolderButton';
import CreateFolderButton from './Children/CreateFolderButton';

const FloatingButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="fixed z-[999] bottom-5 right-5">
      <div className="relative">
        {/* dials */}
        <div className="absolute bottom-[70px] left-1 grid grid-cols-1 gap-3">
          <CreateFolderButton open={open} />
          <AddFileButton open={open} />
          <AddFolderButton open={open} />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="group w-12 h-12 rounded-full bg-blue-300 hover:bg-blue-400 flex items-center justify-center"
        >
          <GrAdd size={20} className={`transform transition-all ${open ? 'rotate-45' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(FloatingButton);
