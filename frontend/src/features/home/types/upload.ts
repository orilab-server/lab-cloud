export type MyFolder = {
  type: 'folder';
  path: string;
  name: string;
  fileNames: string[];
  files: File[];
  isDrop?: boolean;
};

export type MyFile = {
  type: 'file';
  path: string;
  file: File;
  isDrop?: boolean;
};

export type UploadStatus = 'pending' | 'start' | 'suspended' | 'finish';

export type UploadFileProgress = {
  name: string;
  path: string;
  target: MyFile;
  progress: number;
  text: string;
  status: UploadStatus;
};

export type UploadFolderProgress = {
  name: string;
  path: string;
  target: MyFolder;
  progress: number;
  totalSize: number;
  totalLoadedSize: number;
  loadedSize: number;
  text: string;
  status: UploadStatus;
};
