import { FileOrDir } from './storage';

export type Response = {
  name: string;
  type: FileOrDir;
  data: Blob | null;
};

export type DownloadStatus = 'pending' | 'suspended' | 'finish';

export type DownloadProgress = {
  name: string;
  text: string;
  type: FileOrDir;
  progress: number;
  status: DownloadStatus;
};
