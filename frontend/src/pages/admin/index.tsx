import MainLayout from '@/features/admin/components/Layout/MainLayout';
import ContentsLayout from '@/shared/components/Layout/ContentsLayout';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const collectionNames = ['news', 'researches', 'members'];

const boxColors = {
  news: 'bg-red',
  researches: 'bg-blue',
  members: 'bg-green',
};

const Admin: NextPage = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <ContentsLayout>
        {/* コンテンツ */}
        <div className="grid grid-cols-3 gap-3 p-5">
          {collectionNames.map((colName) => (
            <button
              className={`card aspect-square flex items-center justify-center bg-gray-400 hover:bg-gray-600`}
              key={colName}
              onClick={() =>
                router.push({ pathname: '/admin/[collection]', query: { collection: colName } })
              }
            >
              <div className="text-xl text-white">
                {colName.charAt(0).toUpperCase()}
                {colName.slice(1)}を編集
              </div>
            </button>
          ))}
        </div>
      </ContentsLayout>
    </MainLayout>
  );
};

export default Admin;
