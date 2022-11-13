import { DownloadProgress } from '@/features/home/types/download';
import { MyFile, MyFolder, UploadProgress } from '@/features/home/types/upload';
import { atom, selector } from 'recoil';

type NotifyType = {
  severity: 'info' | 'error';
  text: string;
};

export const notifyState = atom<NotifyType | null>({
  key: 'notifyState',
  default: null,
});

export const downloadResponsesState = atom<DownloadProgress[]>({
  key: 'downloadResponsesState',
  default: [],
});

export const filesState = atom<MyFile[]>({
  key: 'filesState',
  default: [],
});

export const foldersState = atom<MyFolder[]>({
  key: 'foldersState',
  default: [],
});

export const uploadProgressesState = atom<UploadProgress[]>({
  key: 'uploadProgressesState',
  default: [],
});

// selector

export const filesExists = selector<boolean>({
  key: 'filesExists',
  get: ({ get }) => {
    const files = get(filesState);
    return files.length > 0;
  },
});

export const foldersExists = selector<boolean>({
  key: 'folderExists',
  get: ({ get }) => {
    const folders = get(foldersState);
    return folders.length > 0;
  },
});
