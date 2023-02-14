import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { endFilenameSlicer } from '@/shared/utils/slice';
import { Button, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React, { SetStateAction } from 'react';
import { useDownload } from '../../api/download';
import { StorageFileOrDirItem } from '../../types/storage';
import { SelectList } from '../misc/SelectList';

type DownloadFromLinkModalProps = {
  currentDir: string;
  downloadSelectedArray: StorageFileOrDirItem[];
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
  setDownloadFromLink,
}: DownloadFromLinkModalProps) => {
  const router = useRouter();
  const downloadMutation = useDownload();

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
      <Box sx={modalStyle}>
        <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
          <Stack>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>
              以下をダウンロードしますか？
            </Typography>
            {downloadMutation.isLoading && (
              <Typography sx={{ fontSize: 14 }}>※ダウンロード後, 移動します</Typography>
            )}
          </Stack>
          <SelectList selects={downloadSelectedArray} />
          <Stack direction="row" spacing={2}>
            <Button
              sx={{ whiteSpace: 'nowrap' }}
              size="medium"
              variant="contained"
              onClick={async () => {
                await downloadMutation
                  .mutateAsync({
                    path: currentDir,
                    targets: downloadSelectedArray.map((item) => ({
                      name: endFilenameSlicer(item.path),
                      type: item.type,
                    })),
                  })
                  .finally(async () => {
                    setDownloadFromLink(false);
                    await router.push(`/home?path=${router.query.path}`);
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
                await router.push(`/home?path=${router.query.path}`);
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
