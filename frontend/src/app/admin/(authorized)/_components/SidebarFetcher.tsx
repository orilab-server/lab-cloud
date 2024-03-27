import { get } from '@/app/_shared/lib/fetch';
import { RegisterRequest } from '../_types/register';
import Sidebar from './Sidebar';

export const SidebarFetcher = async () => {
  const registerRequests = await getRegisterRequests();

  return <Sidebar registerRequests={registerRequests} />;
};

const getRegisterRequests = async () => {
  const res = await get(`/admin/register-requests`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = (await res.json()) as { requests: RegisterRequest[] };
  return json.requests;
};
