import { notifyState } from '@/stores';
import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const uploadFiles = async (files: File[], path: string) => {
  if (files.length === 0) {
    alert('ファイルが選択されていません');
    return;
  }
  const formData = new FormData();
  formData.append('requestType', 'files');
  for (const file of files) {
    formData.append('files', file);
  }
  await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/home/upload?path=${path}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const useUploadFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);

  const addFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles([...files, ...Array.from(event.target.files)]);
  };

  const deleteFile = (name: string) => {
    const newFiles = files.filter((file) => file.name !== name);
    setFiles(newFiles);
  };

  const fileUploadMutation = useMutation(async (path: string) => uploadFiles(files, path), {
    onSuccess: async () => {
      setNotify({ severity: 'info', text: 'アップロードしました' });
      await queryClient.invalidateQueries('storage');
    },
    onError: () => {
      setNotify({
        severity: 'error',
        text: 'エラーが発生しました',
      });
    },
  });
  return { files, addFiles, deleteFile, fileUploadMutation };
};
