import { parseFileSizeStr } from '@/shared/utils/size';
import { format } from 'date-fns';
import React from 'react';
import { AiFillFile, AiFillFolder } from 'react-icons/ai';
import { useGetTrashItems } from '../../api/trash/getTrashItems';
import { useRemoveItems } from '../../api/trash/removeItems';
import { useRestoreItems } from '../../api/trash/restoreItems';
import { useCtxMenu } from '../../hooks/trash/useCtxMenu';
import { useTrashSelect } from '../../hooks/trash/useTrashSelect';

const TrashList = () => {
  const trashItemsQuery = useGetTrashItems();
  const trashList = trashItemsQuery.data || [];
  const { selected, onClickWithKey } = useTrashSelect(trashList);
  const { ctxMenuRef, showCtxMenu, setShowCtxMenu, onCtxMenu } = useCtxMenu();
  const removeItemsMutation = useRemoveItems();
  const restoreItemsMutation = useRestoreItems();

  const removeItems = () => {
    if (confirm('削除しますか？')) {
      const formData = new FormData();
      formData.append(
        'ids',
        [...Array.from(new Set([...Array.from(selected), showCtxMenu]))].join(','),
      );
      removeItemsMutation.mutate({ formData });
      setShowCtxMenu(null);
    }
  };

  const restoreItems = () => {
    const formData = new FormData();
    formData.append(
      'ids',
      [...Array.from(new Set([...Array.from(selected), showCtxMenu]))].join(','),
    );
    restoreItemsMutation.mutate({ formData });
    setShowCtxMenu(null);
  };

  return (
    <>
      <div className="grid grid-cols-6 w-[calc(100vw_-_16rem)] min-w-[1000px] px-2 py-1 divide-x border-b fixed top-14 bg-white">
        <div className="col-span-3 pl-2">名前</div>
        <div className="pl-2">サイズ</div>
        <div className="pl-2">種類</div>
        <div className="pl-2">追加日</div>
      </div>
      <div className="pt-9"></div>
      {trashList.map((item, i) => {
        return (
          <div
            id={item.id}
            key={item.id}
            onClick={(e) => onClickWithKey(e, item.id)}
            onContextMenu={(e) => onCtxMenu(e, item.id)}
            className={`relative grid grid-cols-6 px-2 mx-2 py-1 rounded-md ${
              showCtxMenu === item.id
                ? 'bg-blue-300'
                : selected.has(item.id)
                ? 'bg-blue-300'
                : (i + 1) % 2
                ? ''
                : 'bg-gray-200'
            } cursor-pointer`}
            ref={ctxMenuRef}
          >
            <div className="col-span-3 flex items-center">
              {item.type === 'dir' ? (
                <AiFillFolder className="mr-2 text-gray-600" />
              ) : (
                <AiFillFile className="mr-2 text-gray-600" />
              )}
              <span className="">{item.name}</span>
            </div>
            <div className="pl-3">{parseFileSizeStr(item.size)}</div>
            <div className="pl-3">
              {item.type === 'dir'
                ? 'フォルダ'
                : `${item.name.slice(item.name.lastIndexOf('.') + 1).toUpperCase()}ファイル`}
            </div>
            <div className="pl-3">{format(new Date(item.created_at), 'yyyy/MM/dd hh:mm')}</div>
            {/* context menu */}
            {showCtxMenu && showCtxMenu === item.id && (
              <div className={`absolute top-3 right-[750px] bg-gray-800 rounded z-10 text-sm`}>
                <div className="mx-auto rounded border border-gray-600 py-3 grid grid-cols-1 gap-2 whitespace-nowrap">
                  <button onClick={removeItems} className="text-white hover:bg-gray-700 px-3 py-1">
                    ゴミ箱から削除
                  </button>
                  <button onClick={restoreItems} className="text-white hover:bg-gray-700 px-3 py-1">
                    元の場所に戻す
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div className="pb-9"></div>
      <div className="fixed bottom-0 w-full pl-2 py-1 bg-white border-t flex space-x-2 text-gray-500">
        <span>Trash</span>
      </div>
    </>
  );
};

export default React.memo(TrashList);
