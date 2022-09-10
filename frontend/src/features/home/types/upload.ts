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

export type UploadProgress = {
  name: string;
  path: string;
  target: MyFile | MyFolder;
  progress: number;
  text: string;
  status: 'pending' | 'start' | 'suspended' | 'finish';
};
