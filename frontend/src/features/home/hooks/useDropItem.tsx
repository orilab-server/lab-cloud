import { filesState, foldersState } from '@/stores/index';
import { startDirPathSlicer } from '@/utils/slice';
import { Box } from '@mui/material';
import { ReactElement, useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useSetRecoilState } from 'recoil';

interface ExtendedFile extends File {
  path: string;
}

type DropAreaProps = {
  children: ReactElement;
};

type ReturnType = [({ children }: DropAreaProps) => JSX.Element, boolean];

export const useDropItem = (path: string): ReturnType => {
  const setFiles = useSetRecoilState(filesState);
  const setFolders = useSetRecoilState(foldersState);
  const [isDrop, setIsDrop] = useState<boolean>(false);

  const onDrop = useCallback(async (accepted: File[]) => {
    const targetFiles = accepted
      .filter((item) => (item as ExtendedFile).path.match('/') === null)
      .map((item) => ({ type: 'file' as 'file', path, file: item, isDrop: true }));
    const filesInFolder = accepted.filter(
      (item) => (item as ExtendedFile).path.match('/') !== null,
    );
    const relativePaths = filesInFolder.map((item) =>
      startDirPathSlicer((item as ExtendedFile).path.slice(1)),
    );
    const noMultiRelativePaths = new Set(relativePaths);
    const targetFolders = Array.from(noMultiRelativePaths).map((relativePath) => {
      const files = filesInFolder.filter(
        (fileInFolder) =>
          relativePath === startDirPathSlicer((fileInFolder as ExtendedFile).path.slice(1)),
      );
      const fileNames = files.map((item) => (item as ExtendedFile).path);
      return {
        type: 'folder' as 'folder',
        path,
        name: relativePath,
        fileNames,
        files,
        isDrop: true,
      };
    });
    if (targetFiles.length > 0) {
      setFiles(targetFiles);
    }
    if (targetFolders.length > 0) {
      setFolders(targetFolders);
    }
    setIsDrop(true);
  }, []);

  const DropArea = ({ children }: DropAreaProps) => {
    return (
      <Dropzone onDrop={onDrop} noClick={true}>
        {({ getRootProps, getInputProps }) => (
          <Box {...getRootProps()}>
            <input {...getInputProps()} />
            {children}
          </Box>
        )}
      </Dropzone>
    );
  };

  return [DropArea, isDrop];
};
