import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { AiFillFile, AiFillFolder } from 'react-icons/ai';

type SelectListProps = {
  selects: { name: string; type: 'dir' | 'file' }[];
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
