import TrashList from '@/app/(authorized)/trash/_components/TrashList';
import { getWithAuth } from '@/app/_shared/lib/fetch';
import { TrashItem } from '../home/_types/trash';

const Page = async () => {
  const trashItems = await getTrashItems();

  return <TrashList trashItems={trashItems} />;
};

export default Page;

const getTrashItems = async () => {
  const res = await getWithAuth('/home/trash', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json = (await res.json()) as { trashItems: TrashItem[] };
  return json.trashItems;
};
