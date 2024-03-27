import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { foldersState } from '../_stores';

export const usePreparingUploadFolder = () => {
  const searchParams = useSearchParams();
  const setFolders = useSetRecoilState(foldersState);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOpen = () => {
    inputRef.current?.click();
  };

  const onChangeFolder = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const folder = Object.entries(
        Array.from(e.target.files).reduce((n, p) => {
          const relativePath = p.webkitRelativePath.slice(0, p.webkitRelativePath.lastIndexOf('/'));
          if (Object.keys(n).includes(relativePath)) {
            return { ...n, [relativePath]: [...n[relativePath as keyof typeof n], p] };
          }
          return { ...n, [relativePath]: [p] };
        }, {}),
      ).map(([k, v]) => ({
        top: k.split('/').filter((p) => p)[0],
        path: `/${searchParams.get('path') || ''}/${k}`.replaceAll('//', '/'),
        files: v as File[],
      }));
      setFolders((old) => {
        const folderMap = new Map([...old, ...folder].map((f) => [f.path, f]));
        return Array.from(folderMap.values());
      });
    }
  };

  return { inputRef, handleClickOpen, onChangeFolder };
};
