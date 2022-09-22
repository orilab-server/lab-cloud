export type FileOrDir = 'dir' | 'file';

export type StorageFileOrDirItem = {
  id: string;
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
  trashdir: string;
  ishome: boolean;
  istrash: boolean;
  topdirs: string[];
  important: boolean;
};
