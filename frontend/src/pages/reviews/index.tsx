import BreadCrumbs from '@/features/reviews/components/BreadCrumbs';
import GridEvents from '@/features/reviews/components/GridEvents';
import ContentsLayout from '@/shared/components/Layout/ContentsLayout';
import MainLayout from '@/shared/components/Layout/MainLayout';
import { NextPage } from 'next';

const Reviews: NextPage = () => {
  return (
    <MainLayout>
      <ContentsLayout>
        <GridEvents />
        <BreadCrumbs />
      </ContentsLayout>
    </MainLayout>
  );
};

export default Reviews;
