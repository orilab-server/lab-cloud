import { useUser } from '@/features/auth/api/getUser';
import { useDownloadReviewFile } from '@/features/reviews/api/downloadReviewFile';
import { useGetTeacherReviewedFiles } from '@/features/reviews/api/getTeacherReviewedFiles';
import { useUploadFile } from '@/features/reviews/api/uploadFile';
import DownloadButton from '@/features/reviews/components/menu/buttons/DownloadButton';
import ReviewLayout from '@/features/reviews/components/ReviewLayout';
import SubHeader from '@/features/reviews/components/SubHeader';
import UploadFileArea from '@/features/reviews/components/UploadFileArea';
import { TeacherReviewedFiles } from '@/features/reviews/types/review';
import { useMenuBox } from '@/shared/hooks/useMenuBox';
import { Box, Chip, Divider, Stack, TextField, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const boxStyle = {
  width: '100%',
  cursor: 'pointer',
  py: 2,
  '&:hover': {
    background: 'rgba(0,0,0,0.1)',
  },
};

interface MessageInput {
  message: string;
}

type FileListProps = {
  index: number;
  filePath: string;
  reviewedFile: TeacherReviewedFiles;
  onDownload: () => Promise<void>;
};

const FileList = ({ index, filePath, reviewedFile, onDownload }: FileListProps) => {
  const [MenuBox, onOpen, onClose] = useMenuBox();

  return (
    <Box key={reviewedFile.id} sx={boxStyle} onContextMenu={onOpen}>
      <Stack direction="row" spacing={1} alignItems="center">
        {index === 0 && <Chip size="small" label="最新" variant="outlined" color="info" />}
        <Box>
          <Typography sx={{ fontSize: '14px', mx: 1 }}>{reviewedFile.file_name}</Typography>
          <Typography sx={{ fontSize: '10px', mx: 1 }}>
            {reviewedFile.created_at
              .replaceAll('-', '/')
              .slice(0, reviewedFile.created_at.indexOf('+') - 1)}
          </Typography>
        </Box>
        <MenuBox id={reviewedFile.id}>
          <DownloadButton
            path={filePath}
            onDownload={async () => onDownload().finally(() => onClose())}
          />
        </MenuBox>
      </Stack>
    </Box>
  );
};

const TeacherReview: NextPage = () => {
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
  const reviewedFilesQuery = useGetTeacherReviewedFiles(reviewId, reviewedId);
  const reviewedFiles = reviewedFilesQuery.data?.files || [];
  const userId = reviewedFilesQuery.data?.user_id;
  const [file, setFile] = useState<File | null>(null);
  const uploadFileMutation = useUploadFile('docx');
  const userQuery = useUser();
  const user = userQuery.data;
  const downloadFileMutation = useDownloadReviewFile();
  const isOwn = Boolean(userId && user?.id && Object.is(userId, user.id));

  const { control, getValues } = useForm<MessageInput>({
    defaultValues: {
      message: '',
    },
  });

  const onUpload = async () => {
    if (file !== null && user?.name) {
      const formData = new FormData();
      formData.append('targetDir', `${reviewName}/${userId}/teacher`);
      formData.append('userName', user.name);
      formData.append('email', user.email);
      formData.append('message', getValues('message').trim() || 'ご確認よろしくお願い申し上げます');
      formData.append('file', file);
      await uploadFileMutation
        .mutateAsync({ reviewedId, reviewId, formData })
        .finally(() => setFile(null));
    }
  };

  return (
    <ReviewLayout>
      <SubHeader
        labels={[reviewName, reviewedName, 'For Students']}
        labelVariants={['filled', 'outlined', 'filled']}
        labelColors={['primary', 'default', 'success']}
        buttonChipNumber={3}
        toTeacherOrStudentReview={{
          pathname: '/reviews/[review_id]/[reviewed_id]',
          query: {
            review_id: reviewId,
            reviewed_id: reviewedId,
            review_name: reviewName,
            reviewed_name: reviewedName,
          },
        }}
      />
      {isOwn && (
        <>
          <Divider sx={{ width: '100%' }} />
          <UploadFileArea
            file={file}
            isLoading={uploadFileMutation.isLoading}
            setFile={setFile}
            type="docx"
            textInput={
              <Controller
                control={control}
                name="message"
                render={({ field }) => (
                  <TextField multiline placeholder="先生へのメッセージを記入できます" {...field} />
                )}
              />
            }
            onUpload={onUpload}
          />
        </>
      )}
      <Divider sx={{ width: '100%' }} />
      <Stack sx={{ width: '100%' }} justifyContent="start" divider={<Divider />}>
        {reviewedFiles.map((reviewedFile, i) => {
          const filePath = `${reviewName}/${userId}/teacher/${reviewedFile.file_name}`;
          const url = `home/reviews/${reviewId}/reviewed/${reviewedId}/files/${reviewedFile.id}/download`;

          return (
            <FileList
              index={i}
              reviewedFile={reviewedFile}
              filePath={filePath}
              onDownload={async () => await downloadFileMutation.mutateAsync({ filePath, url })}
            />
          );
        })}
      </Stack>
    </ReviewLayout>
  );
};

export default TeacherReview;
