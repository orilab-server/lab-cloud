import React from 'react';
import { Button } from './Button';

type ModalProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  buttonTxt: string;
  footerButton?: React.ReactNode;
  go?: () => void;
  close: () => void;
};

const Modal = ({ title, children, isOpen, buttonTxt, footerButton, go, close }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center items-center overflow-y-auto fixed z-[999] inset-0 outline-none focus:outline-none">
        <div className="relative min-w-[600px] w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl text-gray-800 font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto border-0 text-black opacity-30 float-right text-3xl font-semibold"
                onClick={close}
              >
                <span className="text-black text-2xl block outline-none">×</span>
              </button>
            </div>
            {/*body*/}
            <div className="relative w-full p-6 flex-auto">
              <div className="w-full my-4 text-slate-500 text-lg leading-relaxed">{children}</div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b">
              <div>{footerButton}</div>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="dangerText"
                  onClick={close}
                  className="ease-linear transition-all duration-150"
                >
                  閉じる
                </Button>
                <Button
                  variant="primaryContained"
                  onClick={go}
                  className="ease-linear transition-all duration-150"
                >
                  {buttonTxt}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default React.memo(Modal);
