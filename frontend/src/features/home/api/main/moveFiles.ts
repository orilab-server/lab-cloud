import { myAuthAxiosGet } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

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

type MoveFilesMutationConfig = {
  path: string;
  targetPaths: string;
  toFolder: string;
};

type MoveFilesToHigherMutationConfig = {
  path: string;
  targetPaths: string;
  fromFolder: string;
};

export const useMoveFiles = () => {
  const router = useRouter();
  const queryPath = router.query.path;
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);

  return {
    moveFilesMutation: useMutation({
      mutationFn: (config: MoveFilesMutationConfig) => moveFiles(config),
      onSuccess: async () => {
        await queryClient.invalidateQueries(['storage', { queryPath }]);
        setNotify({ severity: 'info', text: 'ファイルを移動しました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'ファイルの移動に失敗しました' });
      },
    }),
    moveFilesToHigherMutation: useMutation({
      mutationFn: (config: MoveFilesToHigherMutationConfig) => moveFilesToHiger(config),
      onSuccess: async () => {
        await queryClient.invalidateQueries(['storage', { queryPath }]);
        setNotify({ severity: 'info', text: 'ファイルを移動しました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'ファイルの移動に失敗しました' });
      },
    }),
  };
};
