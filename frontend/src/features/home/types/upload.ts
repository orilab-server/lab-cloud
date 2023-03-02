export type ExFile = { path: string; file: File };

export type ExFolder = {
  top: string;
  path: string;
  files: File[];
};

export type FileUploadProgress = {
  name: string;
  progress: number;
  status: 'pending' | 'rejected' | 'finished';
  target: ExFile;
};

export type FolderUploadProgress = {
  name: string;
  progress: number;
  status: 'pending' | 'rejected' | 'finished';
  target: ExFolder;
};
