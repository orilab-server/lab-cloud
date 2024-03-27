import { User } from '@/app/_types/user';
import { get } from '../_shared/lib/fetch';

export const getUser = async () => {
  try {
    const res = await get(`/user`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return (await res.json()) as User;
  } catch {
    return null;
  }
};
