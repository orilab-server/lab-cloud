import { filesState, foldersState } from '@/shared/stores';
import { startDirPathSlicer } from '@/shared/utils/slice';
import React from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { MyFile, MyFolder } from '../types/upload';

export type Uploads = {
  files: MyFile[];
  folders: MyFolder[];
  setFiles: SetterOrUpdater<MyFile[]>;
  setFolders: SetterOrUpdater<MyFolder[]>;
  addFiles: (event: React.ChangeEvent<HTMLInputElement>, path: string) => void;
  addFolders: (event: React.ChangeEvent<HTMLInputElement>, path: string) => void;
  deleteFile: (name: string) => void;
  deleteFolder: (name: string) => void;
  resetFiles: () => void;
  resetFolders: () => void;
};

export const useUpload = () => {
  const [files, setFiles] = useRecoilState(filesState);
  const [folders, setFolders] = useRecoilState(foldersState);

  const addFiles = (event: React.ChangeEvent<HTMLInputElement>, path: string) => {
    if (event.target.files !== null) {
      const newFiles = Array.from(event.target.files).map((file) => ({
        type: 'file' as 'file',
        path,
        file,
      }));
      const noMultipleFiles = newFiles.filter(
        (newItem) => !files.some((item) => newItem.file.name === item.file.name),
      );
      if (newFiles.length > noMultipleFiles.length) {
        alert('重複したファイルがあったため追加できませんでした');
      }
      setFiles([...files, ...noMultipleFiles]);
    }
  };

  const addFolders = (event: React.ChangeEvent<HTMLInputElement>, path: string) => {
    if (event.target.files !== null) {
      const files = [...Array.from(event.target.files)];
      const fileNames = files.map((file) => file.webkitRelativePath);
      const dirName = startDirPathSlicer(fileNames[0]);
      if (folders.some((folder) => folder.name === dirName)) {
        alert('フォルダが重複しています');
        return;
      }
      setFolders([
        ...folders,
        {
          type: 'folder',
          path,
          name: dirName,
          fileNames,
          files,
        },
      ]);
    }
  };

  const deleteFile = (name: string) => {
    const newFiles = files.filter((item) => item.file.name !== name);
    setFiles(newFiles);
  };

  const deleteFolder = (name: string) => {
    const newFolders = folders.filter((folder) => folder.name !== name);
    setFolders(newFolders);
  };

  return {
    files,
    folders,
    setFiles,
    setFolders,
    addFiles,
    addFolders,
    deleteFile,
    deleteFolder,
    resetFiles: () => setFiles([]),
    resetFolders: () => setFolders([]),
  };
};
