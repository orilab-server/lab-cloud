import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSetRecoilState } from 'recoil';
import { fileUploadProgressesState, folderUploadProgressesState } from '../_stores';
import { useUploadFiles } from './useUploadFiles';
import { useUploadFolders } from './useUploadFolders';

export const useDropFile = () => {
  const searchParams = useSearchParams();
  const paramPath = searchParams.get('path');
  const setFileUploadProgresses = useSetRecoilState(fileUploadProgressesState);
  const setFolderUploadProgresses = useSetRecoilState(folderUploadProgressesState);
  const uploadFoldersMutation = useUploadFolders();
  const uploadFilesMutation = useUploadFiles();

  // type T には`path`プロパティが含まれている(react-dropzoneの仕様)
  const onDrop = useCallback(async <T extends File>(acceptedFiles: T[]) => {
    const folders = Object.entries(
      acceptedFiles
        .filter((file) => (file as any).path.split('/').filter((p: any) => p).length > 1)
        .map((file) => ({
          path: (file as any).path.slice(0, (file as any).path.lastIndexOf('/')) as string,
          file,
        }))
        .reduce((n, p) => {
          if (Object.keys(n).includes(p.path)) {
            return { ...n, [p.path]: [...n[p.path as keyof typeof n], p.file] };
          }
          return { ...n, [p.path]: [p.file] };
        }, {}),
    ).map(([k, v]) => ({
      // acceptefFilesがフォルダだった場合 → File内のpathのフォーマットは `/${path}/{name}
      // サーバーに送信するpathのフォーマット : `/{path}`
      top: k.split('/').filter((p) => p)[0],
      path: `${paramPath || ''}/${k as string}`.replace('//', '/'),
      files: v as File[],
    }));
    const files = acceptedFiles
      .filter((file) => (file as any).path.split('/').filter((p: any) => p).length === 1)
      .map((file) => ({
        path: (paramPath || '/').replace('//', '/'),
        file,
      }));
    const uniqueFiles = Array.from(new Map([...files].map((f) => [f.file.name, f])).values());
    const uniqueFolders = Array.from(new Map([...folders].map((f) => [f.path, f])).values());
    if (uniqueFiles.length > 0) {
      setFileUploadProgresses((old) => [
        ...old,
        ...uniqueFiles.map((f) => ({
          name: f.file.name,
          progress: 0,
          status: 'pending' as 'pending',
          target: f,
        })),
      ]);
      await uploadFilesMutation.mutateAsync();
    }
    if (uniqueFolders.length > 0) {
      setFolderUploadProgresses((old) => [
        ...old,
        ...uniqueFolders.map((f) => ({
          name: f.top,
          progress: 0,
          status: 'pending' as 'pending',
          target: f,
        })),
      ]);
      await uploadFoldersMutation.mutateAsync();
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
  };
};
