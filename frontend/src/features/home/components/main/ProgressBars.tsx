import { Accordion, AccordionSummary, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { MdExpandLess } from 'react-icons/md';
import { UseMutationResult } from 'react-query';
import { DownloadProgress } from '../../types/download';
import DownloadProgressSnackBar from '../misc/progress/DownloadProgressBar';
import { UploadProgressSnackBar } from '../misc/progress/UploadProgressBar';

type ProgressBarsProps = {
  downloadProgresses?: DownloadProgress[];
  downloadCancelMutation?: UseMutationResult<void, unknown, string, unknown>;
  isFromLink?: boolean;
};

const ProgressBars = ({
  downloadProgresses,
  downloadCancelMutation,
  isFromLink,
}: ProgressBarsProps) => {
  const DownloadProgressBar = React.memo(() => (
    <Accordion
      sx={{
        background: 'rgba(0,0,0,0.2)',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
      }}
    >
      <AccordionSummary expandIcon={<MdExpandLess />}>
        <Typography sx={{ px: 1, fontWeight: 'bold' }}>Downloads</Typography>
      </AccordionSummary>
      {downloadProgresses?.map((downloadProgress) => {
        return (
          <DownloadProgressSnackBar
            key={downloadProgress.name}
            response={downloadProgress}
            cancel={() => downloadCancelMutation?.mutate(downloadProgress.name)}
            isFromLink={isFromLink}
          />
        );
      })}
    </Accordion>
  ));

  return (
    <Stack
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
      }}
      spacing={1}
    >
      <DownloadProgressBar />
      <UploadProgressSnackBar />
    </Stack>
  );
};

export default React.memo(ProgressBars);
