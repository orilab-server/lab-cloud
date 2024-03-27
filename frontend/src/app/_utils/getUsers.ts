import { getWithAuth } from '../_shared/lib/fetch';
import { User } from '../_types/user';

export const getUsers = async () => {
  try {
    const res = await getWithAuth('/users', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = (await res.json()) as { users: User[] };
    return json.users;
  } catch (e) {
    return [];
  }
};
