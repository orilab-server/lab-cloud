import { FileOrDir } from './storage';

export type MvTrashRequest = {
  path: string;
  itemType: FileOrDir;
};

export type RmRequest = {
  type: FileOrDir;
  id: string;
  path: string;
};
