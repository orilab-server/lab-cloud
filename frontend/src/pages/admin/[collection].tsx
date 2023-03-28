import { useCollection } from '@/features/admin/api/getCollection';
import ContentsLayout from '@/features/admin/components/layout/ContentsLayout';
import MainLayout from '@/features/admin/components/layout/MainLayout';
import { UserContents } from '@/features/admin/components/members/MemberContents';
import { NewsContents } from '@/features/admin/components/news/NewsContents';
import { ResearchContents } from '@/features/admin/components/researches/ResearchContents';
import { Collections, Member, News, Research } from '@/features/admin/types';
import { useRouter } from 'next/router';

const extractCorrectTypeData = (data: (News | Research | Member)[] | undefined) => {
  if (!data || data.length === 0) {
    return [];
  }
  switch (data[0].type) {
    case 'news':
      return data as News[];
    case 'researches':
      return data as Research[];
    case 'members':
      return data as Member[];
  }
};

const CollectionEditor = () => {
  const router = useRouter();
  const collectionName = router.query.collection as string as Collections;
  const collectionQuery = useCollection(collectionName);

  const correctData = extractCorrectTypeData(collectionQuery.data);

  const WhichContents = ({ data }: { data: News[] | Research[] | Member[] }) => {
    if (data.length === 0) {
      return null;
    }

    switch (data[0].type) {
      case 'news':
        return <NewsContents data={data as News[]} />;
      case 'researches':
        return <ResearchContents data={data as Research[]} />;
      case 'members':
        return <UserContents data={data as Member[]} />;
    }
  };

  return (
    <MainLayout>
      <ContentsLayout>
        <div className="p-5">
          <WhichContents data={correctData} />
        </div>
      </ContentsLayout>
    </MainLayout>
  );
};

export default CollectionEditor;
