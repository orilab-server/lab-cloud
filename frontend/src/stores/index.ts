import { ResponseProgress } from '@/features/home/types/response';
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
