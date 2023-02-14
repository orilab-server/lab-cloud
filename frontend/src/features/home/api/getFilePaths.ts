import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Storage } from '../types/storage';

export const getFilePaths = async (paramPath: string | null) => {
  const res = await myAuthAxiosGet(`/home/?path=${paramPath || '/'}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = res.data as Storage;
  const { filePaths, topDirs, baseDir, isTop, important } = data;
  console.log(filePaths);
  if (!filePaths || String(filePaths) === 'null') {
    return {
      filePaths: [],
      currentdir: paramPath,
      topDirs,
      baseDir,
      isTop,
      important,
    };
  }
  const parseFilePaths = JSON.parse(String(filePaths)) as Storage['filePaths'];
  const currentdir = parseFilePaths[0].path.slice(0, parseFilePaths[0].path.lastIndexOf('/'));
  return {
    filePaths: parseFilePaths,
    currentdir,
    topDirs,
    baseDir,
    isTop,
    important,
  };
};

export const useFilePaths = () => {
  const router = useRouter();
  const queryPath = router.query.path;
  return useQuery(['storage', { queryPath }], async () =>
    getFilePaths((queryPath as string) || ''),
  );
};
