import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSetRecoilState } from 'recoil';
import { filesState, foldersState } from '../../modules/stores';

export const useDropFile = () => {
  const router = useRouter();
  const setFiles = useSetRecoilState(filesState);
  const setFolders = useSetRecoilState(foldersState);
  // type T には`path`プロパティが含まれている(react-dropzoneの仕様)
  const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
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
      path: `${router.query.path || ''}/${k as string}`.replace('//', '/'),
      files: v as File[],
    }));
    // console.log(folders);
    const files = acceptedFiles
      .filter((file) => (file as any).path.split('/').filter((p: any) => p).length === 1)
      .map((file) => ({
        path: ((router.query.path as string) || '/').replace('//', '/'),
        file,
      }));
    setFiles((old) =>
      Array.from(new Map([...old, ...files].map((f) => [f.file.name, f])).values()),
    );
    setFolders((old) => Array.from(new Map([...old, ...folders].map((f) => [f.path, f])).values()));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
  };
};
