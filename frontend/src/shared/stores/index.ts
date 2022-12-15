import { DownloadProgress } from '@/features/home/types/download';
import {
  MyFile,
  MyFolder,
  UploadFileProgress,
  UploadFolderProgress,
} from '@/features/home/types/upload';
import { atom, selector } from 'recoil';

type NotifyType = {
  severity: 'info' | 'error';
  text: string;
};

export const notifyState = atom<NotifyType | null>({
  key: 'notifyState',
  default: null,
});

export const filesState = atom<MyFile[]>({
  key: 'filesState',
  default: [],
});

export const foldersState = atom<MyFolder[]>({
  key: 'foldersState',
  default: [],
});

export const inDropAreaState = atom<boolean>({ key: 'inDropAreaState', default: false });

export const fileUploadProgressesState = atom<UploadFileProgress[]>({
  key: 'fileUploadProgressesState',
  default: [],
});

export const folderUploadProgressesState = atom<UploadFolderProgress[]>({
  key: 'folderUploadProgressesState',
  default: [],
});

export const downloadProgressesState = atom<DownloadProgress[]>({
  key: 'downloadProgressesState',
  default: [],
});

export type PdfReviewState = {
  fileId: string;
  path: string;
  fileName: string;
};

export const pdfReviewState = atom<PdfReviewState | null>({
  key: 'pdfReviewState',
  default: null,
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
