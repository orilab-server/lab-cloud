import { notifyState } from '@/shared/stores';
import { myAxiosPost } from '@/shared/utils/axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { MvTrashRequest } from '../../types/request';

export const sendMvTrashRequest = async (targets: MvTrashRequest[], formData: FormData) => {
  await Promise.all(
    targets.map(async (target) => {
      await myAxiosPost(
        `home/request/mv-trash?path=${target.path}&itemType=${target.itemType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    }),
  );
};

type MvTrashRequestMutationConfig = {
  targets: MvTrashRequest[];
  formData: FormData;
};

export const useMvTrashRequest = () => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ targets, formData }: MvTrashRequestMutationConfig) =>
      sendMvTrashRequest(targets, formData),
    {
      onSuccess: async () => {
        setNotify({ severity: 'info', text: 'ゴミ箱に移動しました' });
        await queryClient.invalidateQueries('storage');
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
