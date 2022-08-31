import { startDirPathSlicer } from '@/utils/slice';
import axios from 'axios';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

type Folder = {
  name: string;
  fileNames: string[];
  files: File[];
};

export const uploadFolders = async (folders: Folder[], path: string) => {
  if (folders.length === 0) {
    alert('ファイルが選択されていません');
    return;
  }
  const formData = new FormData();
  formData.append('type', 'upload');
  formData.append('requestType', 'dirs');
  for (const folder of folders) {
    folder.files.forEach((file) => formData.append('files', file));
    formData.append('filePaths', folder.fileNames.join(' // '));
  }
  await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/home/upload?path=${path}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const useUploadFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const queryClient = useQueryClient();

  const addFolders = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = [...Array.from(event.target.files)];
    const fileNames = files.map((file) => file.webkitRelativePath);
    setFolders([
      ...folders,
      {
        name: startDirPathSlicer(files[0].webkitRelativePath),
        fileNames,
        files,
      },
    ]);
  };

  const deleteFolder = (name: string) => {
    const newFolders = folders.filter((folder) => folder.name !== name);
    setFolders(newFolders);
  };

  const folderUploadMutation = useMutation(async (path: string) => uploadFolders(folders, path), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('storage');
    },
  });
  return { folders, addFolders, deleteFolder, folderUploadMutation };
};
