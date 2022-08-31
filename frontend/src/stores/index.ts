import { atom } from 'recoil';

export const sessionState = atom<string | null>({
  key: 'sessionState',
  default: null,
});

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: false,
});

export const userNameState = atom<string | null>({
  key: 'userNameState',
  default: null,
});

export const isTemporaryState = atom<boolean>({
  key: 'isTemporaryState',
  default: false,
});
