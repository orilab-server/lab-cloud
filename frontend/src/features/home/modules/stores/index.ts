import { atom } from 'recoil';
import { DownloadFileProgress } from '../../types/download';
import { ContextMenu } from '../../types/storage';
import { ExFile, ExFolder, FileUploadProgress, FolderUploadProgress } from '../../types/upload';

export const filesState = atom<ExFile[]>({
  key: 'filesState',
  default: [],
});

export const foldersState = atom<ExFolder[]>({
  key: 'foldersState',
  default: [],
});

export const fileUploadProgressesState = atom<FileUploadProgress[]>({
  key: 'fileUploadProgressesState',
  default: [],
});

export const folderUploadProgressesState = atom<FolderUploadProgress[]>({
  key: 'folderUploadProgressesState',
  default: [],
});

export const downloadProgressesState = atom<DownloadFileProgress[]>({
  key: 'downloadProgressesState',
  default: [],
});

export const selectedFilesState = atom<Set<string>>({
  key: 'selectedFilesState',
  default: new Set(),
});

export const contextMenuState = atom<ContextMenu>({
  key: 'contextMenuState',
  default: {},
});
