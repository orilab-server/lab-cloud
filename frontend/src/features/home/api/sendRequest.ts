import { notifyState } from '@/stores';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { MkRmRequest } from '../types/request';

export const sendRequest = async (body: MkRmRequest, path: string) => {
  const formData = new FormData();
  formData.append('type', 'command');
  formData.append('requestType', body.requestType);
  formData.append('dirName', body.dirName || '');
  formData.append('fileName', body.fileName || '');
  await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/home/upload?path=${path}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return body.requestType;
};

export type SendRequestMutationConfig = {
  body: MkRmRequest;
  path: string;
};

export const useSendRequest = () => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);
  return useMutation(
    async (config: SendRequestMutationConfig) => sendRequest(config.body, config.path),
    {
      onSuccess: async (requestType) => {
        setNotify({
          severity: 'info',
          text: requestType.match('rm') !== null ? '削除しました' : '作成しました',
        });
        await queryClient.invalidateQueries('storage');
      },
      onError: () => {
        setNotify({
          severity: 'error',
          text: 'エラーが発生しました',
        });
      },
    },
  );
};
