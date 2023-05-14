import { useMoveFilesWithDrop } from '@/features/home/hooks/main/useMoveFilesWithDrop';
import { contextMenuState, previewFilePathState } from '@/features/home/modules/stores';
import { parseFileSizeStr } from '@/shared/utils/size';
import { extractDateInStr } from '@/shared/utils/slice';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { AiFillFile, AiFillFolder } from 'react-icons/ai';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useCtxMenu } from '../../../hooks/main/useCtxMenu';
import { useDropFile } from '../../../hooks/main/useDropFile';
import { useFileSelect } from '../../../hooks/main/useFileSelect';
import { StorageContext } from '../../../modules/contetexts/storage';
import ContextMenu from './../ContextMenu';
import FloatingButton from './../FloatingButton';
import BreadCrumbs from './BreadCrumbs';
import RenameInput from './Elements/RenameInput';
import UploadList from './UploadList';

const FileList = () => {
  const router = useRouter();
  const currentPath = router.query?.path || '';
  const { getRootProps, getInputProps, isDragActive } = useDropFile();
  const storage = useContext(StorageContext);
  const storageItems = storage?.fileNames || [];
  const important = Boolean(storage?.important);
  const { selected, add, onClickWithKey } = useFileSelect(storageItems);
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

  const moveDir = async (path: string) => {
    await router.push(`/home/?path=${path}`);
  };

  return (
    <div {...getRootProps()}>
      <input hidden {...getInputProps()} />
      {isDragActive && (
        <div
          {...getRootProps()}
          className="fixed z-[1000] bottom-0 right-0 w-[calc(100vw_-_16rem)] h-[calc(100vh_-_56px)] bg-gray-800 flex items-center justify-center bg-opacity-40"
        >
          <BsFillArrowDownCircleFill size={60} className="animate-bounce" />
        </div>
      )}
      <div className="fixed grid grid-cols-6 w-[calc(100vw_-_16rem)] min-w-[800px] z-[2] px-2 py-1 divide-x border-b top-14 bg-white">
        <div className="col-span-3 pl-2">名前</div>
        <div className="pl-2">サイズ</div>
        <div className="pl-2">種類</div>
        <div className="pl-2">追加日</div>
      </div>
      <div className="pt-9"></div>
      <UploadList />
      {storageItems.map((item, i) => {
        const { name: fileName } = item;
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
            {/* context menu */}
            <div className={`${showCtxMenu && showCtxMenu === fileName ? '' : 'hidden'}`}>
              <ContextMenu selected={selected} />
            </div>
          </div>
        );
      })}
      <div className="pb-9"></div>
      <BreadCrumbs />
      <FloatingButton />
      <div
        {...getRootProps()}
        className="z-[-999] absolute w-[calc(100vw_-_16rem)] h-screen bg-white bottom-0 right-0"
      >
        <input hidden {...getInputProps()} />
      </div>
    </div>
  );
};

export default React.memo(FileList);
