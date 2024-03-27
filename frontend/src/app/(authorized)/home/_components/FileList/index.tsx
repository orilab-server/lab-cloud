'use client';

import { useMoveFilesWithDrop } from '@/app/(authorized)/home/_hooks/useMoveFilesWithDrop';
import { contextMenuState, previewFilePathState } from '@/app/(authorized)/home/_stores';
import { parseFileSizeStr } from '@/app/_shared/utils/size';
import { extractDateInStr } from '@/app/_shared/utils/slice';
import { User } from '@/app/_types/user';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { AiFillFile, AiFillFolder } from 'react-icons/ai';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useCtxMenu } from '../../_hooks/useCtxMenu';
import { useFileSelect } from '../../_hooks/useFileSelect';
import { Dir } from '../../_types/storage';
import ContextMenu from '../ContextMenu';
import RenameInput from './Elements/RenameInput';
import { FileListLayout } from './FileListLayout';
import UploadList from './UploadList';

type Props = {
  dir: Dir;
  user: User;
};

const FileList = ({ dir: { fileNodes, important }, user }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPath = searchParams.get('path') || '';
  const { selected, add, onClickWithKey } = useFileSelect(fileNodes);
  const {
    dragStart,
    dropInFolder,
    moveFilesMutation,
    droppable,
    saveDroppableDir,
    resetDroppable,
  } = useMoveFilesWithDrop();
  const { ctxMenuRef, showCtxMenu, setShowCtxMenu, onCtxMenu } = useCtxMenu();
  const contextMenu = useRecoilValue(contextMenuState);
  const setPreviewFilePath = useSetRecoilState(previewFilePathState);

  const moveDir = (path: string) => {
    router.push(`/home/?path=${path}`);
  };

  return (
    <FileListLayout>
      <div className="fixed grid grid-cols-6 w-[calc(100vw_-_16rem)] min-w-[800px] z-[2] px-2 py-1 divide-x border-b top-14 bg-white">
        <div className="col-span-3 pl-2">名前</div>
        <div className="pl-2">サイズ</div>
        <div className="pl-2">種類</div>
        <div className="pl-2">追加日</div>
      </div>
      <div className="pt-9"></div>
      <UploadList />
      {fileNodes.map((item, i) => {
        const fileName = item.name;
        const nameArray = Array.from(fileName);
        const [displayName, createdAt] = extractDateInStr(fileName);
        const fileExtension =
          nameArray[0] !== '.' && nameArray.includes('.')
            ? `${fileName.slice(fileName.lastIndexOf('.') + 1)}ファイル`
            : '-';

        return (
          <div
            key={fileName}
            onClick={(e) => onClickWithKey(e, fileName)}
            onContextMenu={(e) => {
              onCtxMenu(e, fileName);
              add(fileName);
            }}
            onDoubleClick={() =>
              item.type === 'dir'
                ? moveDir(`${currentPath}/${fileName}`)
                : setPreviewFilePath(`${currentPath}/${fileName}`)
            }
            className={`relative grid grid-cols-6 px-2 mx-2 py-1 rounded-md transition duration-500 ${
              droppable === fileName
                ? 'bg-gray-400'
                : selected.has(fileName)
                ? 'bg-blue-300'
                : (i + 1) % 2
                ? ''
                : 'bg-gray-200'
            } cursor-pointer text-gray-800 ${droppable === fileName ? 'scale-[101%]' : ''}`}
            ref={ctxMenuRef}
          >
            <div
              // ファイル移動関連
              draggable
              onDragStart={() => dragStart(fileName)}
              onDrop={() => dropInFolder(fileName, item.type)}
              onDragEnter={() => saveDroppableDir(fileName, item.type)}
              onDragLeave={resetDroppable}
              onDragEnd={resetDroppable}
              className="col-span-3 flex items-center"
            >
              {item.type === 'dir' ? (
                <AiFillFolder className="mr-2 text-gray-600" />
              ) : (
                <AiFillFile className="mr-2 text-gray-600" />
              )}
              {/* ファイル名変更 */}
              {'rename' in contextMenu && fileName === contextMenu.rename ? (
                <RenameInput storageItem={item} />
              ) : (
                <span className="truncate">{displayName}</span>
              )}
            </div>
            <div className="pl-3 text-sm flex items-center">{parseFileSizeStr(item.size)}</div>
            <div className="pl-3 truncate text-sm flex items-center">
              {item.type === 'dir' ? 'フォルダ' : fileExtension}
            </div>
            <div className="pl-3 text-sm truncate">
              {createdAt.length !== 16 ? '-' : createdAt.replaceAll('-', '/')}
            </div>
            {showCtxMenu && showCtxMenu === fileName && (
              <ContextMenu selected={selected} fileNodes={fileNodes} user={user} />
            )}
          </div>
        );
      })}
    </FileListLayout>
  );
};

export default React.memo(FileList);
