import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSetRecoilState } from 'recoil';
import { filesState } from '../../modules/stores';

export const useUploadFile = () => {
  const router = useRouter();
  const setFiles = useSetRecoilState(filesState);
  const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
    setFiles((old) => {
      const fileMap = new Map(
        [
          ...old,
          ...acceptedFiles.map((file) => ({
            path: ((router.query.path as string) || '/').replaceAll('//', '/'),
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
