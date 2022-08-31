import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
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
};

export type SendRequestMutationConfig = {
  body: MkRmRequest;
  path: string;
};

export const useSendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (config: SendRequestMutationConfig) => sendRequest(config.body, config.path),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('storage');
      },
    },
  );
};
