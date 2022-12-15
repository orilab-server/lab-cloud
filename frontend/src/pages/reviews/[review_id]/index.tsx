import { useGetRevieweds } from '@/features/reviews/api/getRevieweds';
import ReviewLayout from '@/features/reviews/components/ReviewLayout';
import SubHeader from '@/features/reviews/components/SubHeader';
import { Divider, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Review: NextPage = () => {
  const router = useRouter();
  const reviewId = (() => {
    const id = router.query.review_id as string;
    if (id) {
      return id;
    }
    return location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
  })();
  const reviewName = router.query.review_name as string;
  const reviewedsQuery = useGetRevieweds(reviewId);
  const revieweds = reviewedsQuery.data || [];

  return (
    <ReviewLayout>
      <SubHeader
        to="/reviews"
        labels={[reviewName]}
        labelColors={['primary']}
        labelVariants={['filled']}
      />
      <Divider sx={{ width: '100%' }} />
      <Stack sx={{ width: '100%' }} justifyContent="start" divider={<Divider />}>
        {revieweds.map((reviewed) => (
          <Box
            key={reviewed.id}
            onClick={() =>
              router.push({
                pathname: '/reviews/[review_id]/[reviewed_id]',
                query: {
                  review_id: reviewId,
                  reviewed_id: reviewed.id,
                  review_name: reviewName,
                  reviewed_name: reviewed.name,
                },
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
            <Typography sx={{ fontSize: '14px', mx: 1 }}>{reviewed.name}</Typography>
          </Box>
        ))}
      </Stack>
    </ReviewLayout>
  );
};

export default Review;
