import { FileOrDir } from './storage';

export type DownloadFileProgress = {
  name: string;
  path: string;
  type: FileOrDir;
  progress: number;
  status: 'pending' | 'rejected' | 'finished';
};
