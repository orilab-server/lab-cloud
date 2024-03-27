import BreadCrumbs from '@/app/(authorized)/reviews/_components/BreadCrumbs';
import FloatingButton from '@/app/(authorized)/reviews/_components/FloatingButton';
import { ReviewFileListFetcher } from '@/app/(authorized)/reviews/_components/ReviewFileListFetcher';
import { getWithAuth } from '@/app/_shared/lib/fetch';
import { ReviewPageProps } from '@/app/_types/pageProps';
import { getUser } from '@/app/_utils/getUser';
import { Suspense } from 'react';

const Review = async ({ params, searchParams }: ReviewPageProps) => {
  const reviewId = (params.review_id as string) || '';
  const reviewName = searchParams.review_name as string;
  const user = await getUser();
  const isReviewTarget = await getIsReviewTarget(reviewId, user?.id);

  return (
    <>
      {/* TODO: Fallbackを作成 */}
      <Suspense fallback={<></>}>
        {/* @ts-expect-error Server Component */}
        <ReviewFileListFetcher reviewId={reviewId} />
      </Suspense>
      <BreadCrumbs reviewName={reviewName} />
      {isReviewTarget && (
        <FloatingButton reviewId={reviewId} reviewName={reviewName} userId={user?.id as number} />
      )}
    </>
  );
};

export default Review;

const getIsReviewTarget = async (reviewId: string, userId: number | undefined) => {
  const res = await getWithAuth(`/reviews/${reviewId}/is-target/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json = (await res.json()) as { isTarget: boolean };
  return json.isTarget;
};
