import { FileOrDir } from './storage';

export type RecentFile = {
  id: string;
  file_name: string;
  location: string;
  type: FileOrDir | 'review';
  created_at: string;
};
