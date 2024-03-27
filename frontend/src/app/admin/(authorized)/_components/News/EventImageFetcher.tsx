import { getImageURL } from '@/app/_shared/lib/firebase/server';
import { EventForFront } from '../../_types/news';
import { NewsItem } from './NewsItem';

type Props = {
  item: EventForFront;
};

export const EventImageFetcher = async ({ item }: Props) => {
  const image = await getImageURL('news', item.id);

  return (
    <NewsItem
      item={item}
      image={image}
      button={
        <button className="card border bg-gray-200 px-2 w-full h-48 hover:bg-gray-500 hover:text-white">
          <div className="card-body">
            <div className="text-sm">{item.date}</div>
            <div className="text-md line-clamp-3">{item.title}</div>
          </div>
        </button>
      }
    />
  );
};
