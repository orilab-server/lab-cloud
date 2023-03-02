import FileList from '@/features/home/components/Recent/FileList';
import ContentsLayout from '@/shared/components/Layout/ContentsLayout';
import MainLayout from '@/shared/components/Layout/MainLayout';

const Recent = () => {
  return (
    <MainLayout>
      <ContentsLayout>
        <FileList />
      </ContentsLayout>
    </MainLayout>
  );
};

export default Recent;
