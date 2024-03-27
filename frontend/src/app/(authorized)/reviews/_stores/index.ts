'use client';

import { atom } from 'recoil';

export const reviewerState = atom<string>({
  key: 'reviewerState',
  default: '',
});
