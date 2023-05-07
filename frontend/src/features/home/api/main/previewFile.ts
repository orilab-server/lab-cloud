import { myAuthAxiosGet } from '@/shared/lib/axios';
import { getMimeType } from '@/shared/utils/mime';
import { endFilenameSlicer } from '@/shared/utils/slice';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { previewFilePathState } from '../../modules/stores';

export const getPreviewFile = async (path: string) => {
  if (!path) {
    return '';
  }
  const name = endFilenameSlicer(path);
  const blobData = await myAuthAxiosGet<Blob>(
    `/download/file?path=${path}&target=${name}&type=file`,
    {
      responseType: 'blob',
    },
  ).then((res) => res.data);
  const asFile = new File([blobData], name, {
    type: getMimeType(name),
  });
  return { url: URL.createObjectURL(asFile), fileName: name };
};

export const usePreviewFile = () => {
  const previewFilePath = useRecoilValue(previewFilePathState);
  // ObjectURLのリソース解放
  const urlQuery = useQuery({
    queryKey: ['preview_file', previewFilePath],
    queryFn: async () => await getPreviewFile(previewFilePath),
  });
  const release = () => urlQuery.data && URL.revokeObjectURL(urlQuery.data.url);

  useEffect(() => {
    if (!previewFilePath) {
      release();
      urlQuery.remove();
    }
    return () => {
      release();
      urlQuery.remove();
    };
  }, [previewFilePath]);

  return urlQuery;
};
