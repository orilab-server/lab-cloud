import { saveFile } from '@/features/home/api/download';
import { ResponseProgress } from '@/features/home/types/response';
import { IconButton, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="white">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

type ProgressSnackBarProps = {
  response: ResponseProgress;
  isFromLink?: boolean;
  cancel: () => void;
};

export const ProgressSnackBar = ({ response, isFromLink, cancel }: ProgressSnackBarProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const { name, text, type, data, start: isOpen, status, progress } = response;
  useEffect(() => {
    console.log(status);
    if (status === 'finish') {
      saveFile({ name, type, data });
    }
  }, [status]);

  if (!isOpen || !isShow) {
    return null;
  }

  const action = (
    <IconButton sx={{ color: 'white' }} onClick={cancel}>
      <Stack alignItems="center">
        <MdCancel />
        <Box sx={{ fontSize: 3 }}>中断</Box>
      </Stack>
    </IconButton>
  );
  return (
    <Stack
      sx={{
        bgcolor: isFromLink ? '#ccc' : '#333',
        px: 3,
        borderRadius: 1,
        color: isFromLink ? '#333' : 'white',
        position: 'relative',
      }}
      direction="row"
      alignItems="center"
      spacing={3}
    >
      <CircularProgressWithLabel value={progress} />
      <Box>{text}</Box>
      {status === 'suspended' ? null : action}
      <MdCancel
        onClick={() => setIsShow(false)}
        style={{ position: 'absolute', top: -6, right: -5 }}
        fontSize={20}
      />
    </Stack>
  );
};
