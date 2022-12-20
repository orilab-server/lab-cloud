import { useUser } from '@/features/auth/api/getUser';
import { useGetReviewedFiles } from '@/features/reviews/api/getReviewedFiles';
import { useUploadFile } from '@/features/reviews/api/uploadFile';
import PdfReview from '@/features/reviews/components/PdfReview';
import ReviewLayout from '@/features/reviews/components/ReviewLayout';
import SubHeader from '@/features/reviews/components/SubHeader';
import UploadFileArea from '@/features/reviews/components/UploadFileArea';
import { pdfReviewState } from '@/shared/stores';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

const boxStyle = {
  width: '100%',
  cursor: 'pointer',
  py: 2,
  '&:hover': {
    background: 'rgba(0,0,0,0.1)',
  },
};

const ReviewedFiles: NextPage = () => {
  const router = useRouter();
  const reviewId = (() => {
    const id = router.query.review_id as string;
    if (id) {
      return id;
    }
    const { pathname } = location;
    return pathname.split('/')[2];
  })();
  const reviewedId = (() => {
    const id = router.query.reviewed_id as string;
    if (id) {
      return id;
    }
    const { pathname } = location;
    return pathname.split('/')[3];
  })();
  const reviewName = router.query.review_name as string;
  const reviewedName = router.query.reviewed_name as string;
  const reviewedFilesQuery = useGetReviewedFiles(reviewId, reviewedId);
  const reviewedFiles = reviewedFilesQuery.data?.files || [];
  const userId = reviewedFilesQuery.data?.user_id;
  const [file, setFile] = useState<File | null>(null);
  const uploadFileMutation = useUploadFile();
  const [pdfReview, setPdfReview] = useRecoilState(pdfReviewState);
  const userQuery = useUser();
  const user = userQuery.data;
  const isOwn = Boolean(userId && user?.id && Object.is(userId, user.id));

  const onUpload = async () => {
    if (file !== null && user?.name) {
      const formData = new FormData();
      formData.append('targetDir', `${reviewName}/${userId}`);
      formData.append('reviewDir', reviewName);
      formData.append('userName', user.name);
      formData.append('url', location.href);
      formData.append('file', file);
      await uploadFileMutation
        .mutateAsync({ reviewedId, reviewId, formData })
        .finally(() => setFile(null));
    }
  };

  if (pdfReview) {
    return (
      <PdfReview
        isOwn={isOwn}
        fileId={pdfReview.fileId}
        userId={user?.id}
        pathName={`home/reviews/${reviewId}/reviewed/${reviewedId}/files`}
      />
    );
  }

  return (
    <ReviewLayout>
      <SubHeader
        labels={[reviewName, reviewedName]}
        labelVariants={['filled', 'outlined']}
        labelColors={['primary', 'default']}
      />
      {isOwn && (
        <>
          <Divider sx={{ width: '100%' }} />
          <UploadFileArea
            file={file}
            isLoading={uploadFileMutation.isLoading}
            setFile={setFile}
            onUpload={onUpload}
          />
        </>
      )}
      <Divider sx={{ width: '100%' }} />
      <Stack sx={{ width: '100%' }} justifyContent="start" divider={<Divider />}>
        {reviewedFiles.map((reviewedFile, i) => (
          <Box
            key={reviewedFile.id}
            onClick={() =>
              setPdfReview({
                fileId: reviewedFile.id,
                path: `${reviewName}/${userId}`,
                fileName: reviewedFile.file_name,
              })
            }
            sx={boxStyle}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {i === 0 && <Chip size="small" label="最新" variant="outlined" color="info" />}
              <Box>
                <Typography sx={{ fontSize: '14px', mx: 1 }}>{reviewedFile.file_name}</Typography>
                <Typography sx={{ fontSize: '10px', mx: 1 }}>
                  {format(new Date(reviewedFile.created_at), 'yyyy-MM-dd hh:mm')}
                </Typography>
              </Box>
              <Chip size="small" label={`${reviewedFile.reviewer_count}件のレビュー`} />
            </Stack>
          </Box>
        ))}
      </Stack>
    </ReviewLayout>
  );
};

export default ReviewedFiles;
