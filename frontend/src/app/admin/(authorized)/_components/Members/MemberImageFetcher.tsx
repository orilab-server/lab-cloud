import { getImageURL } from '@/app/_shared/lib/firebase/server';
import { Member } from '../../_types/member';
import { MemberItem } from './MemberItem';

type Props = {
  item: Member;
};

export const MemberImageFetcher = async ({ item }: Props) => {
  const image = await getImageURL('members', item.id);

  return (
    <MemberItem
      member={item}
      image={image}
      buttonChild={
        <div className="card border bg-gray-200 px-2 w-full h-24 hover:bg-gray-500 hover:text-white">
          <div className="card-body">
            <div className="text-md font-semibold">{item.name}</div>
          </div>
        </div>
      }
    />
  );
};
