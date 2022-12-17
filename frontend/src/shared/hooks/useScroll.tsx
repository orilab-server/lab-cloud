import { IconButton } from '@mui/material';
import React, { useRef } from 'react';
import { BsFillTriangleFill } from 'react-icons/bs';

type ReturnType = [
  React.MemoExoticComponent<() => JSX.Element>,
  React.MutableRefObject<HTMLDivElement | null>,
];

export const useScroll = (): ReturnType => {
  const bottomElmRef = useRef<HTMLDivElement | null>(null);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollBottom = () => {
    bottomElmRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const ScrollButtons = () => {
    return (
      <>
        <IconButton
          onClick={scrollTop}
          sx={{ position: 'fixed', bottom: 35, right: 0, zIndex: 1001 }}
        >
          <BsFillTriangleFill size={30} />
        </IconButton>
        <IconButton
          onClick={scrollBottom}
          sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: 1001 }}
        >
          <BsFillTriangleFill style={{ transform: 'rotateX(180deg)' }} size={30} />
        </IconButton>
      </>
    );
  };

  return [React.memo(ScrollButtons), bottomElmRef];
};
