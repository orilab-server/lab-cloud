import { LoadingSpinner } from '@/components/LoadingSpinner';
import { notifyState } from '@/stores';
import { Button } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React, { SetStateAction } from 'react';
import { UseMutationResult } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { DownloadMutationConfig } from '../../api/download';
import { DownloadProgress } from '../../types/download';
import { SelectList } from '../SelectList';
import ProgressBars from './ProgressBars';

type DownloadFromLinkModalProps = {
  currentDir: string;
  downloadSelectedArray: {
    name: string;
    type: 'dir' | 'file';
  }[];
  downloadProgresses: DownloadProgress[];
  downloadMutation: UseMutationResult<string[], unknown, DownloadMutationConfig, unknown>;
  downloadCancelMutation: UseMutationResult<void, unknown, string, unknown>;
  setDownloadFromLink: (value: SetStateAction<boolean>) => void;
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'white',
  p: 5,
  px: 10,
};

const DownloadFromLinkModal = ({
  currentDir,
  downloadSelectedArray,
  downloadProgresses,
  downloadMutation,
  downloadCancelMutation,
  setDownloadFromLink,
}: DownloadFromLinkModalProps) => {
  const router = useRouter();
  const setNotify = useSetRecoilState(notifyState);

  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100vh',
        bgcolor: 'rgba(0,0,0,0.8)',
        zIndex: 100,
      }}
    >
      <ProgressBars
        downloadProgresses={downloadProgresses}
        downloadCancelMutation={downloadCancelMutation}
        isFromLink={true}
      />
      <Box sx={modalStyle}>
        <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
          <div>以下をダウンロードしますか？</div>
          <SelectList selects={downloadSelectedArray} />
          <Stack direction="row" spacing={2}>
            <Button
              sx={{ whiteSpace: 'nowrap' }}
              size="medium"
              variant="contained"
              onClick={async () => {
                setNotify({ severity: 'info', text: 'ダウンロード後, 移動します' });
                await downloadMutation
                  .mutateAsync({ path: currentDir, targets: downloadSelectedArray })
                  .finally(async () => {
                    setDownloadFromLink(false);
                    await router.push(`/?path=${router.query.path}`);
                  });
              }}
            >
              {downloadMutation.isLoading && (
                <LoadingSpinner size="sm" sx={{ color: '#fff', mr: 1 }} />
              )}
              ダウンロード
            </Button>
            <Button
              onClick={async () => {
                setDownloadFromLink(false);
                await router.push(`/?path=${router.query.path}`);
              }}
            >
              閉じる
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default React.memo(DownloadFromLinkModal);
