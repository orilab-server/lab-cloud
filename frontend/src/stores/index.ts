import { atom } from 'recoil';

export const isTemporaryState = atom<boolean>({
  key: 'isTemporaryState',
  default: false,
});
