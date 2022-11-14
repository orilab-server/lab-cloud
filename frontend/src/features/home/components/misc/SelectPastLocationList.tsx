import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { MdLocationOn } from 'react-icons/md';
import { StorageFileOrDirItem } from '../../types/storage';

type SelectPairLocationListProps = {
  selects: StorageFileOrDirItem[];
};

export const SelectPairLocationList = ({ selects }: SelectPairLocationListProps) => (
  <List sx={{ maxHeight: '45vh', overflow: 'scroll' }}>
    {selects.map((select) => (
      <ListItem key={select.path}>
        <ListItemAvatar>
          <Avatar>
            <MdLocationOn size={20} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={select.pastLocation} />
      </ListItem>
    ))}
  </List>
);
