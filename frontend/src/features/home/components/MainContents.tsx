import { FileIcons } from '@/components/FileIcons';
import { FilePreviewModal } from '@/components/FilePreview';
import { ProgressSnackBar } from '@/components/ProgressSnackBar';
import { endFilenameSlicer, relativePathSlicer, withoutLastPathSlicer } from '@/utils/slice';
import {
  Box,
  Container,
  List,
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
import { getPreviewFile, useDownload } from '../api/download';
import { useSendRequest } from '../api/sendRequest';
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
  const { downloadProgress, downloadMutation, downloadCancelMutation } = useDownload();
  const requestMutation = useSendRequest();
  const prevPath = currentdir.slice(0, currentdir.lastIndexOf('/'));
  const relativePath = relativePathSlicer(currentdir, baseDir);
  const dirs = relativePath.split('/');
  const relativeDirs = relativePath.split('/');

  const copyLink = (path: string) => {
    const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/?path=${path}`;
    navigator.clipboard.writeText(url);
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
      <List>
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
          const path = withoutLastPathSlicer(item.path);
          if (item.type === 'dir') {
            return (
              <ContextMenu
                key={item.path}
                itemName={name}
                itemType="dir"
                path={path}
                copyLink={() => copyLink(item.path)}
                requestMutation={requestMutation}
                downloadMutation={downloadMutation}
              >
                <ListItem
                  onContextMenu={openMyContextMenu}
                  onDoubleClick={() => moveDir(item.path)}
                  className="list-item"
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
          return (
            <ContextMenu
              itemName={name}
              itemType="file"
              path={path}
              copyLink={() => copyLink(currentdir)}
              requestMutation={requestMutation}
              downloadMutation={downloadMutation}
              key={item.path}
            >
              <FilePreviewModal
                onFetchFile={() => getPreviewFile(path, name)}
                fileName={name}
                button={
                  <ListItem onContextMenu={openMyContextMenu} className="list-item" button>
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
      </List>
    </Container>
  );
};
