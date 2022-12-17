import { useCollection } from '@/features/admin/api/getCollection';
import { UserContents } from '@/features/admin/components/members/MemberContents';
import { AdminLayout } from '@/features/admin/components/misc/Layout';
import { NewsContents } from '@/features/admin/components/news/NewsContents';
import { ResearchContents } from '@/features/admin/components/researches/ResearchContents';
import { Collections, Member, News, Research } from '@/features/admin/types';
import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { MdOutlineArrowBack } from 'react-icons/md';

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
    <AdminLayout>
      <Stack sx={{ width: '100%' }} alignItems="start" spacing={2}>
        <Button onClick={() => router.push('/admin')}>
          <MdOutlineArrowBack />
          戻る
        </Button>
        <WhichContents data={correctData} />
      </Stack>
    </AdminLayout>
  );
};

export default CollectionEditor;
