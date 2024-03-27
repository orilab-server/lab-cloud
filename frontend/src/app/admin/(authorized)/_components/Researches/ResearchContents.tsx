import { getCollection } from '@/app/_shared/lib/firebase/server';
import { Suspense } from 'react';
import { CollectionTypes } from '../../_types/collection';
import { ResearchForFront } from '../../_types/research';
import { AddItem } from './AddItem';
import { ResearchImageFetcher } from './ResearchImageFetcher';

type ResearchContentsProps = {
  data: ResearchForFront[];
};

export const ResearchContents = async ({ data }: ResearchContentsProps) => {
  const members = await getCollection<CollectionTypes['members']>('members');

  return (
    <div className="flex flex-col space-y-6" id="research-contents">
      <AddItem members={members} />
      <div className="grid grid-cols-3 gap-3">
        {data.map((item) => {
          return (
            <div id={item.id} key={item.id}>
              <Suspense fallback={<></>}>
                {/* @ts-expect-error Server Component */}
                <ResearchImageFetcher research={item} />
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
};
