import { uploadProgressesState } from '@/stores';
import { Stack } from '@mui/system';
import React from 'react';
import { UseMutationResult, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import { uploadFile, uploadFolder, Uploads } from '../../api/upload';
import { DownloadProgress } from '../../types/download';
import { MyFile, MyFolder } from '../../types/upload';
import { DownloadProgressSnackBar } from '../misc/DownloadProgressBar';
import { UploadProgressSnackBar } from '../misc/UploadProgressBar';

type ProgressBarsProps = {
  downloadProgresses: DownloadProgress[];
  downloadCancelMutation: UseMutationResult<void, unknown, string, unknown>;
  uploads?: Uploads;
  isFromLink?: boolean;
};

const ProgressBars = ({
  downloadProgresses,
  downloadCancelMutation,
  uploads,
  isFromLink,
}: ProgressBarsProps) => {
  const [uploadProgresses, setUploadProgresses] = useRecoilState(uploadProgressesState);
  const queryClient = useQueryClient();
  const updateStorage = async () => await queryClient.invalidateQueries('storage');
  const uploadMyFile = (target: MyFile) => uploadFile(target, setUploadProgresses, updateStorage);
  const uploadMyFolder = (target: MyFolder) =>
    uploadFolder(target, setUploadProgresses, updateStorage);

  return (
    <Stack
      sx={{
        position: 'absolute',
        bottom: 20,
        right: 20,
      }}
      spacing={1}
    >
      {downloadProgresses.map((downloadProgress) => {
        return (
          <DownloadProgressSnackBar
            key={downloadProgress.name}
            response={downloadProgress}
            cancel={() => downloadCancelMutation.mutate(downloadProgress.name)}
            isFromLink={isFromLink}
          />
        );
      })}
      {uploads &&
        uploadProgresses.map((progress) => {
          if (progress.target.type === 'file') {
            return (
              <UploadProgressSnackBar
                key={progress.name}
                uploadProgress={progress}
                upload={() => uploadMyFile(progress.target as MyFile)}
                cancel={() => uploads.uploadCancelMutation.mutate(progress.name)}
              />
            );
          }
          return (
            <UploadProgressSnackBar
              key={progress.name}
              uploadProgress={progress}
              upload={() => uploadMyFolder(progress.target as MyFolder)}
              cancel={() => uploads.uploadCancelMutation.mutate(progress.name)}
            />
          );
        })}
    </Stack>
  );
};

export default React.memo(ProgressBars);