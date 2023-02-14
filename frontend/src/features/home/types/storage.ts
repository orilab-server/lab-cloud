export type FileOrDir = 'dir' | 'file';

export type StorageFileOrDirItem = {
  id: string;
  path: string;
  type: FileOrDir;
  pastLocation: string;
};

export type FileOrDirItem = {
  name: string;
  type: FileOrDir;
};

export type Storage = {
  filePaths: StorageFileOrDirItem[];
  topDirs: string[];
  baseDir: string;
  isTop: boolean;
  important: boolean;
};
