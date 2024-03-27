import { Suspense } from 'react';
import { EventForFront } from '../../_types/news';
import { AddItem } from './AddItem';
import { EventImageFetcher } from './EventImageFetcher';

type NewsContentsProps = {
  data: EventForFront[];
};

export const NewsContents = ({ data }: NewsContentsProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-5" id="news-contents">
      <AddItem />
      <div className="grid grid-cols-3 gap-3">
        {data.map((item) => {
          return (
            <div key={item.id} id={item.id}>
              <Suspense fallback={<></>}>
                {/* @ts-expect-error Server Component */}
                <EventImageFetcher item={item} />
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
};
