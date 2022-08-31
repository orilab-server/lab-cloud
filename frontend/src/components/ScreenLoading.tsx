import { Box } from '@mui/system';
import { LoadingSpinner } from './LoadingSpinner';

export const ScreenLoading = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoadingSpinner />
    </Box>
  );
};
