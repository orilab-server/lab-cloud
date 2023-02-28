import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Events from './Events';
import RegisterModal from './RegisterModal';

const GridEvents = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className="min-w-[1100px] py-3 flex flex-col items-center">
      <div className="my-5 text-xl">イベント</div>
      <div className="grid grid-cols-3 gap-8">
        <button
          onClick={() => setOpenModal(true)}
          className="min-w-[300px] w-[25vw] aspect-square bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
        >
          <AiOutlinePlus size={50} />
        </button>
        <RegisterModal isOpen={openModal} close={() => setOpenModal(false)} />
        <Events />
      </div>
    </div>
  );
};

export default GridEvents;
