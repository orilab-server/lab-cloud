import { FileOrDir } from './storage';

export type Response = {
  name: string;
  type: FileOrDir;
  data: Blob | null;
};

export type DownloadProgress = {
  name: string;
  text: string;
  type: FileOrDir;
  start: boolean;
  progress: number;
  data: Blob | null;
  status: 'pending' | 'suspended' | 'finish';
};
