import { notifyState } from '@/stores';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { MkRmRequest } from '../types/request';

export const sendRequest = async (requests: MkRmRequest[], path: string) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/home/request?path=${path}`;
  const requestsTypes = await Promise.all(
    requests.map(async (request) => {
      const formData = new FormData();
      formData.append('requestType', request.requestType);
      formData.append('dirName', request.dirName || '');
      formData.append('fileName', request.fileName || '');
      await axios.post(url, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return request.requestType;
    }),
  );
  return requestsTypes;
};

export type SendRequestMutationConfig = {
  requests: MkRmRequest[];
  path: string;
};

export const useSendRequest = () => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);
  return useMutation(
    async (config: SendRequestMutationConfig) => sendRequest(config.requests, config.path),
    {
      onSuccess: async (requestTypes) => {
        const doneMk = requestTypes.some((type) => type.match('mk') !== null);
        const message = doneMk ? '作成しました' : '削除しました';
        setNotify({
          severity: 'info',
          text: message,
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
