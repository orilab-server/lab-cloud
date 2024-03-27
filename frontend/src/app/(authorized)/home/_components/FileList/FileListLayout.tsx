'use client';

import React from 'react';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { useDropFile } from '../../_hooks/useDropFile';
import FloatingButton from '../FloatingButton';
import BreadCrumbs from './BreadCrumbs';

type Props = {
  children: React.ReactNode;
};

export const FileListLayout = ({ children }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropFile();

  return (
    <div {...getRootProps()}>
      <input hidden {...getInputProps()} />
      {isDragActive && (
        <div
          {...getRootProps()}
          className="fixed z-[1000] bottom-0 right-0 w-[calc(100vw_-_16rem)] h-[calc(100vh_-_56px)] bg-gray-800 flex items-center justify-center bg-opacity-40"
        >
          <BsFillArrowDownCircleFill size={60} className="animate-bounce" />
        </div>
      )}
      {children}
      <div className="pb-9"></div>
      <BreadCrumbs />
      <FloatingButton />
      <div
        {...getRootProps()}
        className="z-[-999] absolute w-[calc(100vw_-_16rem)] h-screen bg-white bottom-0 right-0"
      >
        <input hidden {...getInputProps()} />
      </div>
    </div>
  );
};
