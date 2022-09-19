import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { AiFillFile, AiFillFolder } from 'react-icons/ai';
import { FileOrDirItem } from '../../types/storage';

type SelectListProps = {
  selects: FileOrDirItem[];
};

export const SelectList = ({ selects }: SelectListProps) => (
  <List sx={{ maxHeight: '45vh', overflow: 'scroll' }}>
    {selects.map((select) => (
      <ListItem key={select.name}>
        <ListItemAvatar>
          <Avatar>{select.type === 'dir' ? <AiFillFolder /> : <AiFillFile />}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={select.name} />
      </ListItem>
    ))}
  </List>
);
