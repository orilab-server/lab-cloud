'use server';

import { myAuthAxiosPatch } from '@/app/_shared/lib/axios';

export const rename = async (param: URLSearchParams) =>
  await myAuthAxiosPatch('/user/rename', param, {
    xsrfHeaderName: 'X-CSRF-Token',
  });
