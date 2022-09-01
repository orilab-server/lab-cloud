import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';

type LoadingSpinnerProps = CircularProgressProps & {
  size?: keyof typeof sizes;
};

const sizes = {
  sm: 20,
  md: 40,
  lg: 60,
  xl: 100,
};

const variants = {
  primary: 'determinate',
  secondary: 'indeterminate',
};

export const LoadingSpinner = ({ size = 'md', ...rest }: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={sizes[size]} {...rest} />
    </Box>
  );
};
