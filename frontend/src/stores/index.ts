import { atom } from 'recoil';

type NotifyType = {
  severity: 'info' | 'error';
  text: string;
};

export const notifyState = atom<NotifyType | null>({
  key: 'notifyState',
  default: null,
});
