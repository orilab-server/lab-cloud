'use server';

import { myAuthAxiosGet } from '@/app/_shared/lib/axios';
import { MoveFilesMutationConfig, MoveFilesToHigherMutationConfig } from '../_types/moveFile';

export const moveFiles = async ({ path, targetPaths, toFolder }: MoveFilesMutationConfig) => {
  await myAuthAxiosGet(
    `/request/move?path=${path}&targetPaths=${targetPaths}&toFolder=${toFolder}`,
  );
};

export const moveFilesToHiger = async ({
  path,
  targetPaths,
  fromFolder,
}: MoveFilesToHigherMutationConfig) => {
  await myAuthAxiosGet(
    `/request/move/higher?path=${path}&targetPaths=${targetPaths}&fromFolder=${fromFolder}`,
  );
};
