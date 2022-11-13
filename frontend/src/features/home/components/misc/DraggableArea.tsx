import { Box } from '@mui/system';
import { useState } from 'react';

type DraggableAreaProps = {
  children: JSX.Element;
};

export const DraggableArea = ({ children }: DraggableAreaProps) => {
  const [inArea, setInArea] = useState<boolean>(false);

  const onOver = () => setInArea(true);
  const onLeave = () => setInArea(false);

  return (
    <Box
      sx={{ bgcolor: inArea ? 'rgba(0,0,0,0.3)' : '', borderRadius: '10px' }}
      onDragOver={onOver}
      onDragLeave={onLeave}
    >
      {children}
    </Box>
  );
};
