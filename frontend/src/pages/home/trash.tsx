import TrashList from '@/features/home/components/Trash/TrashList';
import ContentsLayout from '@/shared/components/Layout/ContentsLayout';
import MainLayout from '@/shared/components/Layout/MainLayout';

const Trash = () => {
  return (
    <MainLayout>
      <ContentsLayout>
        <TrashList />
      </ContentsLayout>
    </MainLayout>
  );
};

export default Trash;
