import { Box, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { ChangeEventHandler, useEffect, useRef } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';

type ResearchItemProps = {
  url?: string;
  edit: boolean;
  fileState: [File | null, React.Dispatch<React.SetStateAction<File | null>>];
};

export const UpdateImageArea = ({ url, edit, fileState }: ResearchItemProps) => {
  const [file, setFile] = fileState;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const clickFileUploadButton = () => {
    inputRef.current?.click();
  };
  const newImageUrl = file === null ? '' : URL.createObjectURL(file);

  const onFileInputChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);
    } else {
      alert('ファイルを選択してください');
    }
  };

  useEffect(() => {
    return () => {
      if (newImageUrl !== '') {
        URL.revokeObjectURL(newImageUrl);
      }
    };
  }, []);

  return (
    <Stack direction="row" justifyContent="start" alignItems="center" sx={{ py: 2 }}>
      <Stack>
        <Typography sx={{ fontSize: 20 }}>画像</Typography>
        {url ? (
          <img width="300px" src={url} alt="" />
        ) : (
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
              fontSize: 42,
              width: '280px',
              aspectRatio: '1/1',
              border: '1px dotted #333',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            なし
          </Stack>
        )}
      </Stack>
      {edit && (
        <>
          <Box sx={{ mx: 2 }}>
            <AiOutlineArrowRight size={50} />
          </Box>
          <Box
            onClick={clickFileUploadButton}
            sx={{
              width: '300px',
              aspectRatio: '1/1',
              border: '1px dotted #333',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 24,
              cursor: 'pointer',
              '&:hover': {
                background: '#ccc',
              },
            }}
          >
            {file ? <img width="300px" src={URL.createObjectURL(file)} alt="" /> : '画像を選択'}
            <input type="file" hidden ref={inputRef} onChange={onFileInputChange} />
          </Box>
        </>
      )}
    </Stack>
  );
};
