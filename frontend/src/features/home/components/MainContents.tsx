import { FileIcons } from '@/components/FileIcons';
import { FilePreviewModal } from '@/components/FilePreview';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProgressSnackBar } from '@/components/ProgressSnackBar';
import { useSelectBox } from '@/hooks/useSelectBox';
import { notifyState } from '@/stores';
import { endFilenameSlicer, relativePathSlicer, withoutLastPathSlicer } from '@/utils/slice';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import SelectionArea from '@viselect/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiFillFolder } from 'react-icons/ai';
import { MdArrowBack } from 'react-icons/md';
import { VscFiles } from 'react-icons/vsc';
import { useSetRecoilState } from 'recoil';
import { useSelector } from '../../../hooks/useSelector';
import { getPreviewFile, useDownload } from '../api/download';
import { useSendRequest } from '../api/sendRequest';
import { Storage } from '../types/storage';
import { ContextMenu } from './ContextMenu';
import { NewMenu } from './NewMenu';
import { SelectList } from './SelectList';

type MainContentsProps = {
  filepaths: Storage['filepaths'];
  currentdir: string;
  baseDir: string;
  isHome: boolean;
  moveDir: (path: string) => Promise<void>;
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'background.paper',
  p: 5,
  px: 10,
};

const selectSortValues = ['昇順', '降順'];

const selectPriorityValues = ['なし', 'フォルダ', 'ファイル'];

const sortFilePaths = (filePaths: { path: string; type: 'dir' | 'file' }[], value: string) => {
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

export const MainContents = ({
  filepaths,
  currentdir,
  baseDir,
  isHome,
  moveDir,
}: MainContentsProps) => {
  const router = useRouter();
  const setNotify = useSetRecoilState(notifyState);
  const { downloadProgress, downloadMutation, downloadCancelMutation } = useDownload();
  const { selected, unSelect, onStart, onMove, onResetKeyDownEscape } = useSelector();
  const requestMutation = useSendRequest();
  const [SortSelectForm, selectedSortValue] = useSelectBox('sort', selectSortValues);
  const [PrioritySelectForm, setctedPriorityValue] = useSelectBox('priority', selectPriorityValues);
  const [downloadFromLink, setDownloadFromLink] = useState<boolean>(false);
  const [downloadSelectedArray, setDownloadSelectedArray] = useState<
    { name: string; type: 'dir' | 'file' }[]
  >([]);
  const selectedArray = Array.from(selected).map((item) => ({
    name: item,
    type: filepaths.find((filepath) => filepath.path.match(`${currentdir}/${item}`))?.type as
      | 'dir'
      | 'file',
  }));
  const prevPath = currentdir.slice(0, currentdir.lastIndexOf('/'));
  const relativePath = relativePathSlicer(currentdir, baseDir);
  const dirs = relativePath.split('/');
  const relativeDirs = relativePath.split('/');

  const openMyContextMenu: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    const queries = router.query;
    if (Boolean(queries.share)) {
      if (downloadFromLink) {
        return;
      }
      const targetNames = (queries.targets as string).split('/');
      const targetTypes = (queries.types as string).split('/');
      const targets = targetNames.map((item, index) => ({
        name: item,
        type: targetTypes[index] as 'dir' | 'file',
      }));
      setDownloadSelectedArray(targets);
      setDownloadFromLink(true);
    }
  }, []);

  if (downloadFromLink) {
    return (
      <Box sx={{ width: '100%', height: '100vh', bgcolor: 'rgba(0,0,0,0.8)', zIndex: 100 }}>
        <Stack
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
          }}
          spacing={1}
        >
          {downloadProgress.map((downloadProgress) => {
            return (
              <ProgressSnackBar
                key={downloadProgress.name}
                response={downloadProgress}
                isFromLink={true}
                cancel={() => downloadCancelMutation.mutate(downloadProgress.name)}
              />
            );
          })}
        </Stack>
        <Box sx={modalStyle}>
          <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
            <div>以下をダウンロードしますか？</div>
            <SelectList selects={downloadSelectedArray} />
            <Stack direction="row" spacing={2}>
              <Button
                sx={{ whiteSpace: 'nowrap' }}
                size="medium"
                variant="contained"
                onClick={async () => {
                  setNotify({ severity: 'info', text: 'ダウンロード後, 移動します' });
                  await downloadMutation
                    .mutateAsync({ path: currentdir, targets: downloadSelectedArray })
                    .finally(async () => {
                      setDownloadFromLink(false);
                      await router.push(`/?path=${router.query.path}`);
                    });
                }}
              >
                {downloadMutation.isLoading && (
                  <LoadingSpinner size="sm" sx={{ color: '#fff', mr: 1 }} />
                )}
                ダウンロード
              </Button>
              <Button
                onClick={async () => {
                  setDownloadFromLink(false);
                  await router.push(`/?path=${router.query.path}`);
                }}
              >
                閉じる
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box onKeyDown={onResetKeyDownEscape} sx={{ flex: 6, height: '100%', pt: 3 }}>
      <Stack
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
        spacing={1}
      >
        {downloadProgress.map((downloadProgress) => {
          return (
            <ProgressSnackBar
              key={downloadProgress.name}
              response={downloadProgress}
              cancel={() => downloadCancelMutation.mutate(downloadProgress.name)}
            />
          );
        })}
      </Stack>
      {!isHome ? (
        <Button color="inherit" onClick={() => moveDir(prevPath)}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <MdArrowBack />
            <Typography>戻る</Typography>
          </Stack>
        </Button>
      ) : null}
      <List>
        <Box py={2}>
          現在のパス :{' '}
          <Typography component="span" sx={{ color: 'rgba(0,0,0,0.5)' }}>
            /{' '}
            <Typography
              component="span"
              onClick={() => moveDir(baseDir)}
              sx={{
                color: 'royalblue',
                borderBottom: '1px solid royalblue',
                cursor: 'pointer',
                '&:hover': {
                  color: 'rgba(0,0,0,0.3)',
                },
              }}
            >
              Share
            </Typography>{' '}
            /{' '}
          </Typography>
          {dirs.map((dir, index) => {
            let targetPath = '/';
            if (relativePath.match(dir)) {
              targetPath = relativeDirs.slice(0, relativeDirs.indexOf(dir) + 1).join('/');
            }
            return (
              <React.Fragment key={dir + index}>
                <Typography
                  component="span"
                  onClick={() => moveDir(baseDir + targetPath)}
                  sx={{
                    color: 'royalblue',
                    borderBottom: '1px solid royalblue',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  {dir}
                </Typography>
                <Typography component="span" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                  {index > 0 && index + 1 !== dirs.length ? ' / ' : null}
                </Typography>
              </React.Fragment>
            );
          })}
        </Box>
        <SortSelectForm size="small" />
        <PrioritySelectForm size="small" />
        {filepaths.length === 0 && (
          <NewMenu
            requestMutation={requestMutation}
            path={currentdir}
            context={true}
            anchorStyle={{ top: -180, left: 400 }}
          >
            <Box
              sx={{
                height: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '20rem',
                  height: '20rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'whitesmoke',
                  border: '1px solid rgba(0,0,0,0)',
                  borderRadius: 50,
                }}
              >
                <VscFiles size={40} />
                <Typography sx={{ mt: 3, color: 'rgba(0,0,0,0.6)' }} fontSize={20}>
                  ファイルを追加してください
                </Typography>
              </Box>
            </Box>
          </NewMenu>
        )}
        <SelectionArea onStart={onStart} onMove={onMove} selectables=".selectable">
          {sortFilePaths(filepaths, `${selectedSortValue}-${setctedPriorityValue}`).map(
            (item, index) => {
              const name = endFilenameSlicer(item.path);
              const type = item.type as 'dir' | 'file';
              const path = withoutLastPathSlicer(item.path);
              const isSelect = selected.has(name);
              const onContextSelects =
                selected.size === 0
                  ? [{ name, type }]
                  : isSelect
                  ? selectedArray
                  : [...selectedArray, { name, type }];
              // リンク共有に使用するためエンコード
              const onContextSelectNames = onContextSelects.map((item) => encodeURI(item.name));
              const onContextSelectTypes = onContextSelects.map((item) => item.type);
              const link = `${
                process.env.NEXT_PUBLIC_CLIENT_URL
              }/?path=${path}&share=true&targets=${onContextSelectNames.join(
                '/',
              )}&types=${onContextSelectTypes.join('/')}`;
              const downloadItems = (targets: { name: string; type: 'dir' | 'file' }[]) => {
                downloadMutation.mutate({
                  path,
                  targets,
                });
                unSelect();
              };
              const requests = onContextSelects.map((select) => {
                if (select.type === 'dir') {
                  return { requestType: 'rmdir', dirName: select.name };
                }
                return { requestType: 'rmfile', fileName: select.name };
              });
              const requestItems = () => {
                requestMutation.mutate({ path, requests });
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
                    requestItems={requestItems}
                    downloadItems={downloadItems}
                  >
                    <ListItem
                      onContextMenu={openMyContextMenu}
                      onDoubleClick={() => moveDir(item.path)}
                      sx={{
                        background: isSelect ? 'skyblue' : index % 2 === 0 ? 'whitesmoke' : '',
                        '&:hover': {
                          background: isSelect
                            ? 'skyblue'
                            : index % 2 === 0
                            ? 'whitesmoke'
                            : 'white',
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
                      <ListItemText
                        className="list-item-text"
                        primary={endFilenameSlicer(item.path)}
                      />
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
                  requestItems={requestItems}
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
                            background: isSelect
                              ? 'skyblue'
                              : index % 2 === 0
                              ? 'whitesmoke'
                              : 'white',
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
            },
          )}
        </SelectionArea>
      </List>
    </Box>
  );
};
