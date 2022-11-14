import { FileIcons } from '@/components/FileIcons';
import { FilePreviewModal } from '@/components/FilePreview';
import { endFilenameSlicer, withoutLastPathSlicer } from '@/utils/slice';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import SelectionArea, { SelectionEvent } from '@viselect/react';
import React from 'react';
import { AiFillFolder } from 'react-icons/ai';
import { UseMutationResult } from 'react-query';
import { DownloadMutationConfig, getPreviewFile } from '../../api/download';
import { useMvTrashRequest } from '../../api/request/mvTrash';
import { useRmRequest } from '../../api/request/rm';
import { FileOrDir, FileOrDirItem, StorageFileOrDirItem } from '../../types/storage';
import { ContextMenu } from '../misc/contextmenu/ContextMenu';

type FilePathListProps = {
  filePaths: StorageFileOrDirItem[];
  isTrash?: boolean;
  important?: boolean;
  selectedValue: string;
  selected: Set<string>;
  selectedArray: StorageFileOrDirItem[];
  downloadMutation: UseMutationResult<string[], unknown, DownloadMutationConfig, unknown>;
  onStart?: ((e: SelectionEvent) => void) | undefined;
  onMove?: ((e: SelectionEvent) => void) | undefined;
  moveDir: (path: string) => Promise<void>;
  unSelect: () => void;
};

const sortFilePaths = (filePaths: StorageFileOrDirItem[], value: string) => {
  if (value === '昇順-なし') {
    return filePaths;
  }
  const sortedFilePaths = filePaths.sort((prev, curr) => {
    if (prev.path < curr.path) return -1;
    if (curr.path < prev.path) return 1;
    return 0;
  });
  const onlySortedFolderPaths = sortedFilePaths.filter((item) => item.type === 'dir');
  const onlySortedFilePaths = sortedFilePaths.filter((item) => item.type === 'file');
  switch (value) {
    case '降順-なし':
      return sortedFilePaths.reverse();
    case '昇順-フォルダ':
      return [...onlySortedFolderPaths, ...onlySortedFilePaths];
    case '昇順-ファイル':
      return [...onlySortedFilePaths, ...onlySortedFolderPaths];
    case '降順-フォルダ':
      return [...onlySortedFolderPaths.reverse(), ...onlySortedFilePaths.reverse()];
    case '降順-ファイル':
    default:
      return [...onlySortedFilePaths.reverse(), ...onlySortedFolderPaths.reverse()];
  }
};

const FilePathList = ({
  filePaths,
  isTrash,
  important,
  selectedValue,
  selected,
  selectedArray,
  downloadMutation,
  onStart,
  onMove,
  moveDir,
  unSelect,
}: FilePathListProps) => {
  const mvTrashMutation = useMvTrashRequest();
  const rmRequestMutation = useRmRequest();
  const openMyContextMenu: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <SelectionArea onStart={onStart} onMove={onMove} selectables=".selectable">
      {sortFilePaths(filePaths, selectedValue).map((item, index) => {
        const { id, pastLocation } = item;
        const name = endFilenameSlicer(item.path);
        const type = item.type as FileOrDir;
        const path = withoutLastPathSlicer(item.path);
        const isSelect = selected.has(name);
        const onContextSelects =
          selected.size === 0
            ? [{ id, path: item.path, type, pastLocation }]
            : isSelect
            ? selectedArray
            : [...selectedArray, { id, path: item.path, type, pastLocation }];
        // リンク共有に使用するためエンコード
        const onContextSelectNames = onContextSelects.map((item) =>
          encodeURI(endFilenameSlicer(item.path)),
        );
        const onContextSelectTypes = onContextSelects.map((item) => item.type);
        const link = `${
          process.env.NEXT_PUBLIC_CLIENT_URL
        }/?path=${path}&share=true&targets=${onContextSelectNames.join(
          '/',
        )}&types=${onContextSelectTypes.join('/')}`;
        const downloadItems = (targets: FileOrDirItem[]) => {
          downloadMutation.mutate({
            path,
            targets,
          });
          unSelect();
        };
        const mvTrashRequest = (targets: FileOrDirItem[]) => {
          const mvTrashItems = targets.map((target) => {
            return { path: path + '/' + target.name, itemType: target.type };
          });
          mvTrashMutation.mutate(mvTrashItems);
          unSelect();
        };
        const rmRequest = (targets: StorageFileOrDirItem[]) => {
          const rmRequestItems = targets.map((target) => {
            return { type: target.type, id: target.id, path: target.path };
          });
          rmRequestMutation.mutate(rmRequestItems);
          unSelect();
        };
        // show dir
        if (type === 'dir') {
          return (
            <ContextMenu
              key={item.path}
              selects={onContextSelects}
              path={path}
              link={link}
              isTrash={isTrash}
              important={important}
              downloadItems={downloadItems}
              mvTrashRequest={mvTrashRequest}
              rmRequest={rmRequest}
            >
              <ListItem
                onContextMenu={openMyContextMenu}
                onDoubleClick={() => moveDir(item.path)}
                sx={{
                  background: isSelect ? 'skyblue' : index % 2 === 0 ? 'whitesmoke' : '',
                  '&:hover': {
                    background: isSelect ? 'skyblue' : index % 2 === 0 ? 'whitesmoke' : 'white',
                  },
                  color: isSelect ? 'rgba(0,0,0,0.5)' : '',
                  borderRadius: 1,
                }}
                className={selected.has(name) ? 'selected selectable' : 'selectable'}
                data-key={name}
                button
              >
                <ListItemIcon>
                  <AiFillFolder size={25} style={{ color: 'steelblue' }} />
                </ListItemIcon>
                <ListItemText className="list-item-text" primary={endFilenameSlicer(item.path)} />
              </ListItem>
            </ContextMenu>
          );
        }
        // show file
        return (
          <ContextMenu
            key={item.path}
            selects={onContextSelects}
            path={path}
            link={link}
            isTrash={isTrash}
            important={important}
            mvTrashRequest={mvTrashRequest}
            rmRequest={rmRequest}
            downloadItems={downloadItems}
          >
            <FilePreviewModal
              onFetchFile={() => getPreviewFile(path, name)}
              fileName={name}
              button={
                <ListItem
                  onContextMenu={openMyContextMenu}
                  sx={{
                    background: isSelect ? 'skyblue' : index % 2 === 0 ? 'whitesmoke' : '',
                    color: isSelect ? 'rgba(0,0,0,0.5)' : '',
                    '&:hover': {
                      background: isSelect ? 'skyblue' : index % 2 === 0 ? 'whitesmoke' : 'white',
                    },
                    borderRadius: 1,
                  }}
                  className={selected.has(name) ? 'selected selectable' : 'selectable'}
                  data-key={name}
                  button
                >
                  <ListItemIcon>
                    <FileIcons fileName={name} />
                  </ListItemIcon>
                  <ListItemText className="list-item-text" primary={name} />
                </ListItem>
              }
            />
          </ContextMenu>
        );
      })}
    </SelectionArea>
  );
};

export default React.memo(FilePathList);
