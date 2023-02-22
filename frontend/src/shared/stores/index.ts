import { atom } from 'recoil';

type NotifyType = {
  severity: 'info' | 'error';
  text: string;
};

export const notifyState = atom<NotifyType | null>({
  key: 'notifyState',
  default: null,
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
