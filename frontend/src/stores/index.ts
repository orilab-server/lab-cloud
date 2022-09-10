import { ResponseProgress } from '@/features/home/types/response';
import { MyFile, MyFolder, UploadProgress } from '@/features/home/types/upload';
import { atom } from 'recoil';

type NotifyType = {
  severity: 'info' | 'error';
  text: string;
};

export const notifyState = atom<NotifyType | null>({
  key: 'notifyState',
  default: null,
});

export const downloadResponsesState = atom<ResponseProgress[]>({
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
