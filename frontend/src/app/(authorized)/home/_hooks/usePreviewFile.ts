'use client';

import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getPreviewFile } from '../_actions/previewFile';
import { previewFilePathState } from '../_stores';

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
