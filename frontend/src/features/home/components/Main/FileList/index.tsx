import { parseFileSizeStr } from '@/shared/utils/size';
import { extractDateInStr } from '@/shared/utils/slice';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillFile, AiFillFolder } from 'react-icons/ai';
import { useRename } from '../../../api/main/rename';
import { useCtxMenu } from '../../../hooks/main/useCtxMenu';
import { useDropFile } from '../../../hooks/main/useDropFile';
import { useFileSelect } from '../../../hooks/main/useFileSelect';
import { useContextMenuContextState } from '../../../modules/contetexts/contextMenu';
import { StorageContext } from '../../../modules/contetexts/storage';
import ContextMenu from './../ContextMenu';
import FloatingButton from './../FloatingButton';
import BreadCrumbs from './BreadCrumbs';
import UploadList from './UploadList';

interface RenameInputs {
  name: string;
}

const FileList = () => {
  const router = useRouter();
  const currentPath = router.query?.path || '';
  const { getRootProps, getInputProps } = useDropFile();
  const storage = useContext(StorageContext);
  const storageItems = storage?.fileNames || [];
  const important = Boolean(storage?.important);
  const { selected, add, onClickWithKey, dropped, dragStart, dropInFolder } =
    useFileSelect(storageItems);
  const { ctxMenuRef, showCtxMenu, setShowCtxMenu, onCtxMenu } = useCtxMenu();
  const [contextMenuState, setContextMenuState] = useContextMenuContextState();
  const { register, getValues, setValue, resetField } = useForm<RenameInputs>({
    defaultValues: {
      name: '',
    },
  });
  // rename
  const renameMutation = useRename();
  const rename = async () => {
    const name = getValues('name');
    const oldName = Array.from(selected)[0];
    if (oldName && name && name.trim()) {
      const [, createdAt] = extractDateInStr(oldName);
      const newName = createdAt
        ? !Array.from(oldName).includes('.')
          ? `${name}_${createdAt}`
          : `${name}_${createdAt}${oldName.slice(oldName.indexOf('.'))}`
        : name;
      await renameMutation.mutateAsync({
        path: `/${(router.query.path as string) || ''}`.replaceAll('//', '/'),
        oldName,
        newName,
      });
      setContextMenuState({ rename: '' });
      resetField('name');
    }
  };
  const renameCancel = () => setContextMenuState({ rename: '' });

  const moveDir = async (path: string) => {
    await router.push(`/home/?path=${currentPath}/${path}`);
  };

  useEffect(() => {
    const selects = Array.from(selected);
    if (selects.length === 1) {
      const [fileName] = extractDateInStr(selects[0]);
      setValue(
        'name',
        Array.from(fileName).includes('.') ? fileName.slice(0, fileName.indexOf('.')) : fileName,
      );
    }
  }, [selected]);

  return (
    <>
      <div className="fixed grid grid-cols-6 w-[calc(100vw_-_16rem)] min-w-[800px] z-[2] px-2 py-1 divide-x border-b top-14 bg-white">
        <div className="col-span-3 pl-2">名前</div>
        <div className="pl-2">サイズ</div>
        <div className="pl-2">種類</div>
        <div className="pl-2">追加日</div>
      </div>
      <div className="pt-9"></div>
      <UploadList />
      {storageItems.map((item, i) => {
        const nameArray = Array.from(item.name);
        const [fileName, createdAt] = extractDateInStr(item.name);
        const fileType =
          nameArray[0] !== '.' && nameArray.includes('.')
            ? `${item.name.slice(item.name.lastIndexOf('.') + 1)}ファイル`
            : '-';

        return (
          <div
            key={item.name}
            {...getRootProps()}
            onClick={(e) => onClickWithKey(e, item.name)}
            onContextMenu={(e) => {
              onCtxMenu(e, item.name);
              add(item.name);
            }}
            onDoubleClick={() => (item.type === 'dir' ? moveDir(item.name) : () => {})}
            className={`relative grid grid-cols-6 px-2 mx-2 py-1 rounded-md ${
              showCtxMenu === item.name
                ? 'bg-blue-300'
                : selected.has(item.name)
                ? 'bg-blue-300'
                : (i + 1) % 2
                ? ''
                : 'bg-gray-200'
            } cursor-pointer text-gray-800`}
            ref={ctxMenuRef}
          >
            <input hidden {...getInputProps()} />
            <div className="col-span-3 flex items-center">
              {item.type === 'dir' ? (
                <AiFillFolder className="mr-2 text-gray-600" />
              ) : (
                <AiFillFile className="mr-2 text-gray-600" />
              )}
              {/* ファイル名変更 */}
              {item.name === contextMenuState.rename ? (
                <div className="h-5 flex space-x-2 items-center">
                  <input
                    id="name"
                    className="text-sm input input-ghost px-1 h-5"
                    type="text"
                    {...register('name')}
                  />
                  {Array.from(item.name).includes('.') && (
                    <span className="text-sm">{item.name.slice(item.name.indexOf('.'))}</span>
                  )}
                  <button
                    onClick={rename}
                    className="flex items-center justify-center w-5 h-5 hover:bg-slate-300 rounded-full"
                  >
                    ○
                  </button>
                  <button
                    onClick={renameCancel}
                    className="flex items-center justify-center w-5 h-5 hover:bg-slate-300 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="truncate">{fileName}</span>
              )}
            </div>
            <div className="pl-3 text-sm flex items-center">{parseFileSizeStr(item.size)}</div>
            <div className="pl-3 truncate text-sm flex items-center">
              {item.type === 'dir' ? 'フォルダ' : fileType}
            </div>
            <div className="pl-3 text-sm">
              {createdAt.length !== 16 ? '-' : createdAt.replaceAll('-', '/')}
            </div>
            {/* context menu */}
            {
              <div className={`${showCtxMenu && showCtxMenu === item.name ? '' : 'hidden'}`}>
                <ContextMenu selected={selected} />
              </div>
            }
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
    </>
  );
};

export default React.memo(FileList);
