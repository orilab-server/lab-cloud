import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { VscFiles } from 'react-icons/vsc';
import { useDropItem } from '../../hooks/useDropItem';
import { DraggableArea } from '../misc/DraggableArea';

type EmptyDirDisplayProps = {
  currentDir: string;
  important?: boolean;
};

const EmptyDirDisplay = ({ currentDir }: EmptyDirDisplayProps) => {
  const [DropArea] = useDropItem(currentDir);

  return (
    <DropArea>
      <DraggableArea>
        <>
          <Box
            sx={{
              height: '80vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '20rem',
                height: '20rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'whitesmoke',
                border: '1px solid rgba(0,0,0,0)',
                borderRadius: 50,
              }}
            >
              <VscFiles size={40} />
              <Typography sx={{ mt: 3, color: 'rgba(0,0,0,0.6)' }} fontSize={20}>
                ファイルを追加してください
              </Typography>
            </Box>
          </Box>
        </>
      </DraggableArea>
    </DropArea>
  );
};

export default React.memo(EmptyDirDisplay);
