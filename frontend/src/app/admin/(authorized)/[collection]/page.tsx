import { getCollection } from '@/app/_shared/lib/firebase/server';
import { AdminPageProps } from '@/app/_types/pageProps';
import { UserContents } from '@/app/admin/(authorized)/_components/Members/MemberContents';
import { NewsContents } from '@/app/admin/(authorized)/_components/News/NewsContents';
import { ResearchContents } from '@/app/admin/(authorized)/_components/Researches/ResearchContents';
import { format } from 'date-fns';
import { CollectionTypes, Collections } from '../_types/collection';
import { Member } from '../_types/member';
import { Event, EventForFront } from '../_types/news';
import { Research, ResearchForFront } from '../_types/research';

const CollectionEditor = async ({ params }: AdminPageProps) => {
  const collectionName = params.collection as Collections;

  const collections = await getCollection<CollectionTypes[Collections]>(collectionName);

  return (
    <div className="p-5">
      {collectionName === 'members' && <UserContents data={collections as Member[]} />}
      {collectionName === 'news' && (
        <NewsContents data={(collections as Event[]).map(eventsMapper)} />
      )}
      {collectionName === 'researches' && (
        // {/* @ts-expect-error Server Component */}
        <ResearchContents data={(collections as Research[]).map(researchMapper)} />
      )}
    </div>
  );
};

export default CollectionEditor;

const eventsMapper = (item: Event): EventForFront => ({
  ...item,
  date: format(new Date(item.date.seconds * 1000), 'yyyy-MM-dd'),
  createdat: format(new Date(item.createdat.seconds * 1000), 'yyyy-MM-dd'),
});

const researchMapper = (item: Research): ResearchForFront => ({
  ...item,
  createdat: format(new Date(item.createdat.seconds * 1000), 'yyyy-MM-dd'),
});
