export type FileOrDir = 'dir' | 'file';

export type StorageFileOrDirItem = {
  path: string;
  type: FileOrDir;
};

export type FileOrDirItem = {
  name: string;
  type: FileOrDir;
};

export type Storage = {
  filepaths: StorageFileOrDirItem[];
  basedir: string;
  ishome: boolean;
  topdirs: string[];
  important: boolean;
};
