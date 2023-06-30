import { AiFillCloseCircle } from 'react-icons/ai';

type ModalLayoutProps = {
  children: React.ReactNode;
  closeModal?: () => void;
};

export const ModalLayout = ({ children, closeModal }: ModalLayoutProps) => {
  return (
    <>
      <button
        onClick={closeModal}
        className="absolute z-[1000] top-0 left-0 p-2 hover:bg-gray-200 rounded-full"
      >
        <AiFillCloseCircle size={30} />
      </button>
      <div className="relative w-[80vw] min-w-[720px] h-[80vh] bg-white rounded p-12 overflow-scroll">
        {children}
      </div>
    </>
  );
};
