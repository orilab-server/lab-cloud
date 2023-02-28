import { useIsReviewTarget } from '@/features/reviews/api/reviews/getIsTarget';
import BreadCrumbs from '@/features/reviews/components/BreadCrumbs';
import FileList from '@/features/reviews/components/FileList';
import FloatingButton from '@/features/reviews/components/FloatingButton';
import ContentsLayout from '@/shared/components/Layout/ContentsLayout';
import MainLayout from '@/shared/components/Layout/MainLayout';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Review: NextPage = () => {
  const router = useRouter();
  const reviewId = ((id: string) =>
    id ? id : location.pathname.slice(location.pathname.lastIndexOf('/') + 1))(
    router.query.review_id as string,
  );
  const isReviewTargetQuery = useIsReviewTarget(reviewId);

  return (
    <MainLayout>
      <ContentsLayout>
        <FileList />
        <BreadCrumbs />
        {isReviewTargetQuery.data && <FloatingButton />}
      </ContentsLayout>
    </MainLayout>
  );
};

export default Review;
