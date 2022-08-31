import { List } from '@mui/material';
import React from 'react';

type CustomListProps = {
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  children: any;
};

export const CustomList = ({ children, onKeyDown, onKeyUp }: CustomListProps) => {
  return (
    <div onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
      <List>{children}</List>
    </div>
  );
};
