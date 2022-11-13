import { useUploadFolderList } from '@/features/home/hooks/useUploadFolderList';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import React from 'react';
import { MdOutlineDriveFolderUpload } from 'react-icons/md';

type FolderUploadButtonProps = {
  path: string;
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
  boxShadow: 24,
  width: '50vw',
  p: 5,
  px: 10,
};

const FolderUploadButton = ({ path }: FolderUploadButtonProps) => {
  const [UploadFolderListModal] = useUploadFolderList();

  return (
    <>
      <UploadFolderListModal
        path={path}
        modalButton={
          <MenuItem>
            <ListItemIcon>
              <MdOutlineDriveFolderUpload fontSize={20} />
            </ListItemIcon>
            <ListItemText>フォルダをアップロード</ListItemText>
          </MenuItem>
        }
      />
    </>
  );
};

export default React.memo(FolderUploadButton);
