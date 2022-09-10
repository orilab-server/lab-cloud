import { filesState, foldersState, notifyState, uploadProgressesState } from '@/stores';
import { getRandom } from '@/utils/random';
import { sleep } from '@/utils/sleep';
import { startDirPathSlicer } from '@/utils/slice';
import axios from 'axios';
import React from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';
import { MyFile, MyFolder, UploadProgress } from '../types/upload';

export type Uploads = {
  files: MyFile[];
  folders: MyFolder[];
  setFiles: SetterOrUpdater<MyFile[]>;
  setFolders: SetterOrUpdater<MyFolder[]>;
  addFiles: (event: React.ChangeEvent<HTMLInputElement>, path: string) => void;
  addFolders: (event: React.ChangeEvent<HTMLInputElement>, path: string) => void;
  deleteFile: (name: string) => void;
  deleteFolder: (name: string) => void;
  filesUploadMutation: UseMutationResult<void, unknown, string, unknown>;
  foldersUploadMutation: UseMutationResult<void, unknown, string, unknown>;
  uploadCancelMutation: UseMutationResult<void, unknown, string, unknown>;
  resetFiles: () => void;
  resetFolders: () => void;
};

const getProgresses = (
  progresses: UploadProgress[],
  name: string,
  params?: Partial<UploadProgress>,
) => {
  return progresses.map((progress) => {
    if (progress.name === name) {
      return {
        ...progress,
        ...params,
      };
    }
    return progress;
  });
};

export const setFilesToUploadProgresses = async (
  files: MyFile[],
  path: string,
  setFiles: SetterOrUpdater<MyFile[]>,
  setProgresses: SetterOrUpdater<UploadProgress[]>,
) => {
  if (files.length === 0) {
    alert('ファイルが選択されていません');
    return;
  }
  const uploadTargets = files.map((item) => ({
    name: item.file.name,
    path,
    target: item,
    progress: 0,
    text: `${item.file.name.slice(0, 6)}...をアップロードしています`,
    status: 'pending' as 'pending',
  }));
  setProgresses((old) => [...old, ...uploadTargets]);
  setFiles((old) =>
    old.filter((item) => uploadTargets.some((target) => item.file.name !== target.name)),
  );
  await sleep(4).then(() => {
    setProgresses((old) => old.map((item) => ({ ...item, status: 'start' })));
  });
};

export const uploadFile = async (
  myFile: MyFile,
  setProgresses: SetterOrUpdater<UploadProgress[]>,
  updateState: () => Promise<void>,
) => {
  const formData = new FormData();
  formData.append('requestType', 'files');
  formData.append('files', myFile.file);
  const fileName = myFile.file.name;
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/home/upload?path=${myFile.path}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    await updateState();
    setProgresses((old) =>
      getProgresses(old, fileName, {
        progress: 100,
        text: `${fileName.slice(0, 6)}...をアップロードしました`,
        status: 'finish',
      }),
    );
  } catch (error) {
    console.log(error);
    setProgresses((old) =>
      getProgresses(old, fileName, {
        progress: 0,
        text: `${fileName.slice(0, 6)}...のアップロードに失敗しました`,
        status: 'suspended',
      }),
    );
  } finally {
    await sleep(6);
    setProgresses((old) => old.filter((item) => item.name !== fileName));
  }
};

export const setFoldersToUploadProgresses = async (
  folders: MyFolder[],
  path: string,
  setFolders: SetterOrUpdater<MyFolder[]>,
  setProgresses: SetterOrUpdater<UploadProgress[]>,
) => {
  if (folders.length === 0) {
    alert('ファイルが選択されていません');
    return;
  }

  const uploadTargets = folders.map((item) => ({
    name: item.name,
    path,
    target: item,
    progress: 0,
    text: `${item.name.slice(0, 6)}...をアップロードしています`,
    status: 'pending' as 'pending',
  }));

  setProgresses((old) => [...old, ...uploadTargets]);
  setFolders((old) =>
    old.filter((item) => uploadTargets.some((target) => item.name !== target.name)),
  );
  await sleep(4).then(() => {
    setProgresses((old) => old.map((item) => ({ ...item, status: 'start' })));
  });
};

export const uploadFolder = async (
  folder: MyFolder,
  setProgresses: SetterOrUpdater<UploadProgress[]>,
  updateState: () => Promise<void>,
) => {
  const folderName = folder.name;
  const formData = new FormData();
  formData.append('requestType', 'dirs');
  let randNumber = getRandom(30, 80);
  await Promise.all(
    folder.files.map(async (file) => {
      formData.append('files', file);
      randNumber++;
      // それっぽく見せるため
      if (randNumber % 3 === 0) {
        await sleep(0.5);
      }
      setProgresses((old) =>
        getProgresses(old, folder.name, { progress: randNumber > 90 ? 80 : randNumber }),
      );
    }),
  );
  formData.append('filePaths', folder.fileNames.join(' // '));
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/home/upload?path=${folder.path}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    await updateState();
    setProgresses((old) =>
      getProgresses(old, folderName, {
        progress: 100,
        text: `${folderName.slice(0, 6)}...をアップロードしました`,
        status: 'finish',
      }),
    );
  } catch (error) {
    console.log(error);
    setProgresses((old) =>
      getProgresses(old, folderName, {
        progress: 0,
        text: `${folderName.slice(0, 6)}...のアップロードに失敗しました`,
        status: 'suspended',
      }),
    );
  } finally {
    await sleep(6);
    setProgresses((old) => old.filter((item) => item.name !== folderName));
  }
};

export const useUpload = () => {
  const [files, setFiles] = useRecoilState(filesState);
  const [folders, setFolders] = useRecoilState(foldersState);
  const setUploadProgresses = useSetRecoilState(uploadProgressesState);
  const setNotify = useSetRecoilState(notifyState);

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

  const filesUploadMutation = useMutation(
    async (path: string) => setFilesToUploadProgresses(files, path, setFiles, setUploadProgresses),
    {
      onError: () => {
        setNotify({
          severity: 'error',
          text: 'エラーが発生しました',
        });
      },
    },
  );

  const foldersUploadMutation = useMutation(
    async (path: string) =>
      setFoldersToUploadProgresses(folders, path, setFolders, setUploadProgresses),
    {
      onError: () => {
        setNotify({
          severity: 'error',
          text: 'エラーが発生しました',
        });
      },
    },
  );

  const uploadCancelMutation = useMutation(async (name: string) => {
    setUploadProgresses((old) =>
      old.map((item) => {
        if (item.name === name) {
          return {
            ...item,
            status: 'suspended',
            text: 'アップロードを中断しました',
          };
        }
        return item;
      }),
    );
    setNotify({ severity: 'info', text: 'アップロードを中断しました' });
    await sleep(6);
    localStorage.removeItem(name + '_uploadCancel');
    setUploadProgresses((old) => old.filter((item) => item.name !== name));
  });

  return {
    files,
    folders,
    setFiles,
    setFolders,
    addFiles,
    addFolders,
    deleteFile,
    deleteFolder,
    filesUploadMutation,
    foldersUploadMutation,
    uploadCancelMutation,
    resetFiles: () => setFiles([]),
    resetFolders: () => setFolders([]),
  };
};
