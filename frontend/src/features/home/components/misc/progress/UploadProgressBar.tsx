import { CircularProgressWithLabel } from '@/shared/components/CircularProgressWithLabel';
import {
  fileUploadProgressesState,
  folderUploadProgressesState,
  notifyState,
} from '@/shared/stores';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { MdCancel, MdExpandLess } from 'react-icons/md';
import { useRecoilState, useSetRecoilState } from 'recoil';

export const UploadProgressSnackBar = () => {
  const [fileUploadProgresses, setFileUploadProgresses] = useRecoilState(fileUploadProgressesState);
  const [folderUploadProgresses, setFolderUploadProgresses] = useRecoilState(
    folderUploadProgressesState,
  );
  const setNotify = useSetRecoilState(notifyState);

  const fileAndFolderProgresses = [...fileUploadProgresses, ...folderUploadProgresses];

  const cancelFileUpload = useCallback(async (name: string) => {
    setFileUploadProgresses((olds) => olds.filter((old) => old.name !== name));
    localStorage.setItem(`cancel_upload_${name}`, 'true');
    setNotify({ severity: 'info', text: 'アップロードをキャンセルしました' });
  }, []);

  const cancelFolderUpload = useCallback(async (name: string) => {
    setFolderUploadProgresses((olds) => olds.filter((old) => old.name !== name));
    localStorage.setItem(`cancel_upload_${name}`, 'true');
    setNotify({ severity: 'info', text: 'アップロードをキャンセルしました' });
  }, []);

  if (fileAndFolderProgresses.length === 0) {
    return null;
  }

  return (
    <Accordion
      sx={{ background: 'rgba(0,0,0,0.3)', borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
    >
      <AccordionSummary expandIcon={<MdExpandLess />}>
        <Typography sx={{ px: 1, fontWeight: 'bold' }}>Uploads</Typography>
      </AccordionSummary>
      {fileAndFolderProgresses.map((target) => {
        return (
          <AccordionDetails key={target.name}>
            <Stack sx={{ px: 1 }} direction="row" alignItems="center" spacing={1}>
              <CircularProgressWithLabel value={target.progress} />
              <Typography sx={{ fontSize: 12 }}>{target.text}</Typography>
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
                  <MdCancel
                    onClick={() =>
                      target.target.type === 'folder'
                        ? cancelFolderUpload(target.name)
                        : cancelFileUpload(target.name)
                    }
                    fontSize={20}
                  />
                  <Typography sx={{ fontSize: 10, color: '#333' }}>中断</Typography>
                </Stack>
              ) : null}
            </Stack>
          </AccordionDetails>
        );
      })}
    </Accordion>
  );
};
