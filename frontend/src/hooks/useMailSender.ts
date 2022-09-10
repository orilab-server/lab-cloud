import { notifyState } from '@/stores';
import axios from 'axios';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const sendMail = async (subject: string, name: string, body: string) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/send`;
  const formData = new FormData();
  formData.append('requestType', 'mail');
  formData.append('who', name as string);
  formData.append('subject', subject);
  formData.append('body', body);
  return await axios.post(url, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type SendMailMutationConfig = {
  subject: string;
  name: string;
  body: string;
};

export const useMailSender = () => {
  const setNotify = useSetRecoilState(notifyState);
  return useMutation(
    async (config: SendMailMutationConfig) => sendMail(config.subject, config.name, config.body),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: 'メールを送信しました' });
      },
      onError: () => {
        setNotify({ severity: 'error', text: 'エラーが発生しました' });
      },
    },
  );
};
