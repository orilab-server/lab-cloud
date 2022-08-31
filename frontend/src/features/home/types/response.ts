export type Response = {
  name: string;
  type: 'dir' | 'file';
  data: Blob | null;
};

export type ResponseProgress = {
  name: string;
  text: string;
  type: 'dir' | 'file';
  start: boolean;
  progress: number;
  data: Blob | null;
  status: 'pending' | 'suspended' | 'finish';
};
