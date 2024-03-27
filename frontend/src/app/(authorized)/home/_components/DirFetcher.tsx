import { getWithAuth } from '@/app/_shared/lib/fetch';
import { getUser } from '@/app/_utils/getUser';
import { Dir } from '../_types/storage';
import { HomeContents } from './HomeContents';

type Props = {
  currentPath: string;
};

export const DirFetcher = async ({ currentPath }: Props) => {
  const dir = await getDir(currentPath);

  const user = await getUser();

  if (!dir || !user) {
    // TODO: エラー表示画面作成
    return null;
  }

  return <HomeContents dir={dir} user={user} />;
};

const getDir = async (currentPath: string | null) => {
  try {
    const res = await getWithAuth(`/home/?path=${currentPath || '/'}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = (await res.json()) as Dir;
    const { fileNodes, important } = json;
    if (!fileNodes) {
      return {
        fileNodes: [],
        important,
      };
    }
    return {
      fileNodes,
      important,
    };
  } catch (e) {
    return null;
  }
};
