import { Menu } from '@mui/material';
import React, { useState } from 'react';

type MenuBoxProps = {
  id: string;
  children: React.ReactNode;
};

type Anchor = null | HTMLElement;

export const useMenuBox = (): ReturnType<
  () => [
    React.MemoExoticComponent<({ children }: MenuBoxProps) => JSX.Element>,
    (event: React.MouseEvent<HTMLElement>) => void,
    () => void,
    boolean,
  ]
> => {
  const [anchorEl, setAnchorEl] = useState<Anchor>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const MenuBox = ({ id, children }: MenuBoxProps) => {
    return (
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        className="z-[998]"
      >
        {children}
      </Menu>
    );
  };

  return [React.memo(MenuBox), handleClick, handleClose, open];
};
