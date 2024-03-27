'use client';

import { notifyState } from '@/app/_shared/stores';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { myAxiosPost } from '../_shared/lib/axios';

export const sendMail = async (subject: string, name: string, body: string, mime?: string) => {
  const formData = new FormData();
  formData.append('requestType', 'mail');
  formData.append('who', name as string);
  formData.append('subject', subject);
  formData.append('mime', mime || '');
  formData.append('body', body);
  return await myAxiosPost('/send', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type SendMailMutationConfig = {
  subject: string;
  name: string;
  body: string;
  mime?: string;
};

export const useMailSender = () => {
  const setNotify = useSetRecoilState(notifyState);
  return useMutation(
    async (config: SendMailMutationConfig) =>
      sendMail(config.subject, config.name, config.body, config.mime),
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
