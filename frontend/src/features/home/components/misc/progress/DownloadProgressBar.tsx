import { CircularProgressWithLabel } from '@/shared/components/CircularProgressWithLabel';
import { downloadProgressesState, notifyState } from '@/shared/stores';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import React from 'react';
import { MdCancel, MdExpandLess } from 'react-icons/md';
import { useRecoilState, useSetRecoilState } from 'recoil';

const DownloadProgressSnackBar = () => {
  const [downloadProgresses, setDownloadProgresses] = useRecoilState(downloadProgressesState);
  const setNotify = useSetRecoilState(notifyState);

  const cancelDownload = (name: string) => {
    setDownloadProgresses((olds) => olds.filter((item) => item.name !== name));
    localStorage.setItem(`download_cancel_${name}`, 'ture');
    setNotify({ severity: 'info', text: `${name}のダウンロードを中断しました` });
  };

  if (downloadProgresses.length === 0) {
    return null;
  }

  return (
    <Accordion
      sx={{
        background: 'rgba(0,0,0,0.2)',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
      }}
    >
      <AccordionSummary expandIcon={<MdExpandLess />}>
        <Stack sx={{ px: 1 }}>
          <Typography sx={{ fontWeight: 'bold' }}>Downloads</Typography>
          <Typography sx={{ fontSize: 10 }}>
            ※大容量フォルダは開始までに時間がかかることがあります
          </Typography>
        </Stack>
      </AccordionSummary>
      {downloadProgresses.map((target) => (
        <AccordionDetails key={target.name}>
          <Stack sx={{ px: 1 }} direction="row" alignItems="center" spacing={1}>
            <CircularProgressWithLabel value={target.progress} />
            <Typography sx={{ fontSize: 13 }}>{target.text}</Typography>
            {target.status !== 'finish' ? (
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '100%',
                  '&:hover': { background: 'rgba(0,0,0,0.1)' },
                }}
              >
                <MdCancel onClick={() => cancelDownload(target.name)} fontSize={20} />
                <Typography sx={{ fontSize: 10, color: '#333' }}>中断</Typography>
              </Stack>
            ) : null}
          </Stack>
        </AccordionDetails>
      ))}
    </Accordion>
  );
};

export default React.memo(DownloadProgressSnackBar);
