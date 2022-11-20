import { endFilenameSlicer } from '@/shared/utils/slice';
import { Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

type TopDirListProps = {
  topDirs: string[];
  moveDir: (path: string) => Promise<void>;
};

const style = {
  width: '100%',
  bgcolor: 'background.paper',
};

const TopDirList = ({ topDirs, moveDir }: TopDirListProps) => {
  return (
    <List sx={style} component="nav">
      <ListItem>
        <ListItemText sx={{ color: 'rgba(0,0,0,0.5)' }}>Share</ListItemText>
      </ListItem>
      <Box
        sx={{
          overflow: 'scroll',
          borderTop: '1px solid rgba(0,0,0,0.6)',
          height: 320,
        }}
      >
        {topDirs.map((item) => (
          <React.Fragment key={item}>
            <ListItem button onClick={() => moveDir(item)}>
              <ListItemText primary={endFilenameSlicer(item)} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </Box>
    </List>
  );
};

export default React.memo(TopDirList);
