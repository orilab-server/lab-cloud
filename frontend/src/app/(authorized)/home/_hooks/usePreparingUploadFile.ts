import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSetRecoilState } from 'recoil';
import { filesState } from '../_stores';

export const usePreparingUploadFile = () => {
  const searchParams = useSearchParams();
  const setFiles = useSetRecoilState(filesState);
  const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
    setFiles((old) => {
      const fileMap = new Map(
        [
          ...old,
          ...acceptedFiles.map((file) => ({
            path: (searchParams.get('path') || '/').replaceAll('//', '/'),
            file,
          })),
        ].map((f) => [f.file.name, f]),
      );
      return Array.from(fileMap.values());
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noDrag: true });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
  };
};
