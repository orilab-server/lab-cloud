import { FileOrDir } from './storage';

export type TrashItem = {
  id: string;
  name: string;
  size: number;
  type: FileOrDir;
  user_id: number;
  past_location: string;
  created_at: string;
};
