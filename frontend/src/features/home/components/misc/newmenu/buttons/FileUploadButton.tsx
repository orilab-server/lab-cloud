import { useUploadFileList } from '@/features/home/hooks/useUploadFileList';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import React from 'react';
import { MdUploadFile } from 'react-icons/md';

type FileUploadButtonProps = {
  path: string;
};

const FileUploadButton = ({ path }: FileUploadButtonProps) => {
  const [UploadFileList] = useUploadFileList();

  return (
    <UploadFileList
      modalButton={
        <MenuItem>
          <ListItemIcon>
            <MdUploadFile fontSize={20} />
          </ListItemIcon>
          <ListItemText>ファイルをアップロード</ListItemText>
        </MenuItem>
      }
      path={path}
    />
  );
};

export default React.memo(FileUploadButton);
