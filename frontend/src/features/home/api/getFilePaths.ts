import { myAxiosGet } from '@/shared/utils/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Storage } from '../types/storage';

export const getFilePaths = async (paramPath: string | null) => {
  const res = await myAxiosGet(`home/?path=${paramPath || '/'}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = res.data as Storage;
  const { filepaths, topdirs, basedir, trashdir, ishome, istrash, important } = data;
  if (String(filepaths) === 'null') {
    return {
      filepaths: [],
      currentdir: paramPath,
      trashdir,
      topdirs,
      basedir,
      ishome,
      istrash,
      important,
    };
  }
  const parseFilePaths = JSON.parse(String(filepaths)) as Storage['filepaths'];
  const currentdir = parseFilePaths[0].path.slice(0, parseFilePaths[0].path.lastIndexOf('/'));
  return {
    filepaths: parseFilePaths,
    currentdir,
    trashdir,
    topdirs,
    basedir,
    ishome,
    istrash,
    important,
  };
};

export const useFilePaths = () => {
  const router = useRouter();
  const queryPath = router.query.path;
  const url = new URL(`${process.env.NEXT_PUBLIC_CLIENT_URL}/?path=${queryPath || ''}`);
  const params = url.searchParams;
  const paramPath = params.get('path');
  return useQuery(['storage', { queryPath }], async () => getFilePaths(paramPath));
};
