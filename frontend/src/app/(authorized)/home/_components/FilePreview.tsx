'use client';

import { previewFilePathState } from '@/app/(authorized)/home/_stores';
// import { getMimeType } from '@/app/_shared/utils/mime';
// import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useSetRecoilState } from 'recoil';
import { usePreviewFile } from '../_hooks/usePreviewFile';

const FilePreview = () => {
  const setPreviewFilePath = useSetRecoilState(previewFilePathState);
  const urlQuery = usePreviewFile();

  if (!urlQuery.data) {
    return null;
  }

  return (
    <div className="fixed z-[999] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[80vw] h-[80vh] bg-gray-500 rounded-md">
      <AiFillCloseCircle
        onClick={() => setPreviewFilePath('')}
        className="fixed right-0 top-0 text-gray-200 cursor-pointer hover:text-gray-400"
        size={30}
      ></AiFillCloseCircle>
      {/* <DocViewer
        className="max-w-[93%] mx-auto"
        documents={[
          {
            uri: urlQuery.data.url,
            fileName: urlQuery.data.fileName,
            fileType: getMimeType(urlQuery.data.fileName),
          },
        ]}
        pluginRenderers={DocViewerRenderers}
      /> */}
    </div>
  );
};

export default FilePreview;
