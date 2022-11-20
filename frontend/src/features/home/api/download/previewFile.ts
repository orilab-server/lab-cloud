import { myAxiosGet } from '@/shared/utils/axios';
import { getMimeType } from '@/shared/utils/mime';
import { useQuery } from 'react-query';

export const getPreviewFile = async (path: string, name: string) => {
  const blobData = await myAxiosGet<Blob>(`home/download?path=${path}&target=${name}&type=file`, {
    responseType: 'blob',
  }).then((res) => res.data);
  const asFile = new File([blobData], name, {
    type: getMimeType(name),
  });
  return URL.createObjectURL(asFile);
};

export const usePreviewFile = (path: string, name: string) => {
  return useQuery({
    queryKey: ['storage', { path, name }],
    queryFn: async () => getPreviewFile(path, name),
  });
};
