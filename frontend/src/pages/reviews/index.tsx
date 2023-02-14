import { useGetReviews } from '@/features/reviews/api/getReviews';
import CreateReviewModal from '@/features/reviews/components/CreateReviewModal';
import ReviewLayout from '@/features/reviews/components/layout/ReviewLayout';
import { Box, Divider, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Reviews: NextPage = () => {
  const router = useRouter();
  const reviewsQuery = useGetReviews();
  const reviews = reviewsQuery.data || [];

  return (
    <ReviewLayout>
      <CreateReviewModal button="新規レビューを追加" />
      <Divider sx={{ width: '100%' }} />
      <Stack sx={{ width: '100%' }} justifyContent="start" divider={<Divider />}>
        {reviews.map((review) => (
          <Box
            key={review.id}
            onClick={() =>
              router.push({
                pathname: '/reviews/[review_id]',
                query: { review_id: review.id, review_name: review.name },
              })
            }
            sx={{
              cursor: 'pointer',
              py: 2,
              '&:hover': {
                background: 'rgba(0,0,0,0.1)',
              },
            }}
          >
            <Typography sx={{ fontSize: '14px', mx: 1 }}>{review.name}</Typography>
          </Box>
        ))}
      </Stack>
    </ReviewLayout>
  );
};

export default Reviews;
