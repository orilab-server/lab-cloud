import { endFilenameSlicer } from '@/utils/slice';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { AiFillFile, AiFillFolder } from 'react-icons/ai';
import { StorageFileOrDirItem } from '../../types/storage';

type SelectListProps = {
  selects: StorageFileOrDirItem[];
};

export const SelectList = ({ selects }: SelectListProps) => (
  <List sx={{ maxHeight: '45vh', overflow: 'scroll' }}>
    {selects.map((select) => (
      <ListItem key={select.path}>
        <ListItemAvatar>
          <Avatar>{select.type === 'dir' ? <AiFillFolder /> : <AiFillFile />}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={endFilenameSlicer(select.path)} />
      </ListItem>
    ))}
  </List>
);
