import { CustomList } from '@/components/CustomList';
import { FileIcons } from '@/components/FileIcons';
import { FilePreviewModal } from '@/components/FilePreview';
import { ProgressSnackBar } from '@/components/ProgressSnackBar';
import { notifyState } from '@/stores';
import { endFilenameSlicer, relativePathSlicer, withoutLastPathSlicer } from '@/utils/slice';
import {
  Box,
  Container,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { AiFillFolder } from 'react-icons/ai';
import { MdArrowBack } from 'react-icons/md';
import { VscFiles } from 'react-icons/vsc';
import { useSetRecoilState } from 'recoil';
import { getPreviewFile, useDownload } from '../api/download';
import { useSendRequest } from '../api/sendRequest';
import { useSelector } from '../hooks/useSelector';
import { Storage } from '../types/storage';
import { ContextMenu } from './ContextMenu';

type MainContentsProps = {
  filepaths: Storage['filepaths'];
  currentdir: string;
  baseDir: string;
  isHome: boolean;
  moveDir: (path: string) => Promise<void>;
};

export const MainContents = ({
  filepaths,
  currentdir,
  baseDir,
  isHome,
  moveDir,
}: MainContentsProps) => {
  const setNotify = useSetRecoilState(notifyState);
  const { downloadProgress, downloadMutation, downloadCancelMutation } = useDownload();
  const { selects, unSelect, clickListItem, onKeyDown, onKeyUp } = useSelector();
  const requestMutation = useSendRequest();
  const prevPath = currentdir.slice(0, currentdir.lastIndexOf('/'));
  const relativePath = relativePathSlicer(currentdir, baseDir);
  const dirs = relativePath.split('/');
  const relativeDirs = relativePath.split('/');

  const copyLink = (path: string) => {
    const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/?path=${path}`;
    navigator.clipboard.writeText(url);
    setNotify({ severity: 'info', text: 'リンクをコピーしました' });
  };

  const openMyContextMenu: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Container sx={{ flex: 4, height: '100%', pt: 3 }}>
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
      <CustomList onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
        {!isHome ? (
          <ListItem onClick={() => moveDir(prevPath)} button>
            <ListItemIcon>
              <MdArrowBack />
            </ListItemIcon>
            <ListItemText className="list-item-text" primary="戻る" />
          </ListItem>
        ) : null}
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
        {filepaths.length === 0 && (
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
        )}
        {filepaths.map((item) => {
          const name = endFilenameSlicer(item.path);
          const type = item.type as 'dir' | 'file';
          const path = withoutLastPathSlicer(item.path);
          const isSelect = selects.some((file) => file.name === name);
          const downloadItems = () => {
            downloadMutation.mutate({
              path,
              targets: selects.length === 0 ? [{ name, type }] : selects,
            });
            unSelect();
          };
          const requests = selects.map((select) => {
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
                itemName={name}
                itemType="dir"
                path={path}
                copyLink={() => copyLink(item.path)}
                requestItems={requestItems}
                downloadItems={downloadItems}
              >
                <ListItem
                  onClick={() => clickListItem(name, 'dir')}
                  onContextMenu={openMyContextMenu}
                  onDoubleClick={() => moveDir(item.path)}
                  className="list-item"
                  sx={{ background: isSelect ? '#ccc' : '' }}
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
              itemName={name}
              itemType="file"
              path={path}
              copyLink={() => copyLink(currentdir)}
              requestItems={requestItems}
              downloadItems={downloadItems}
              key={item.path}
            >
              <FilePreviewModal
                onFetchFile={() => getPreviewFile(path, name)}
                fileName={name}
                button={
                  <ListItem
                    onClick={() => clickListItem(name, 'file')}
                    onContextMenu={openMyContextMenu}
                    className="list-item"
                    sx={{ background: isSelect ? '#ccc' : '' }}
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
      </CustomList>
    </Container>
  );
};
