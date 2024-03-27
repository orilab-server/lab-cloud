import ReviewFile from '@/app/(authorized)/reviews/_components/ReviewFile';
import { getWithAuth } from '@/app/_shared/lib/fetch';
import { getMimeType } from '@/app/_shared/utils/mime';
import { ReviewPageProps } from '@/app/_types/pageProps';
import { getUser } from '@/app/_utils/getUser';

const Page = async ({ params: { review_id, file_id }, searchParams }: ReviewPageProps) => {
  const fileName = (searchParams.file_name as string) || 'unknown';

  const user = await getUser();

  const isReviewHost = await getIsReviewHost(review_id, file_id, user?.id as number);

  const reviewFile = await getReviewFile(review_id, file_id, fileName);

  return (
    <ReviewFile
      reviewId={review_id}
      fileId={file_id}
      userId={user?.id as number}
      isReviewHost={isReviewHost}
      reviewFile={reviewFile}
    />
  );
};

export default Page;

const getIsReviewHost = async (reviewId: string, fileId: string, userId: number) => {
  const res = await getWithAuth(`/reviews/${reviewId}/files/${fileId}/is-host/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json = (await res.json()) as { isHost: boolean };

  return json.isHost;
};

const getReviewFile = async (reviewId: string, fileId: string, fileName: string) => {
  const res = await getWithAuth(`/reviews/${reviewId}/files/${fileId}/download`);
  const blob = await res.blob();
  const asFile = new File([blob], fileName, {
    type: getMimeType(fileName),
  });

  return URL.createObjectURL(asFile);
};
