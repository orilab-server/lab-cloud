import { startDirPathSlicer } from '@/utils/slice';
import { Divider, Theme } from '@mui/material';
import Menu from '@mui/material/Menu';
import { SxProps } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Uploads } from '../../../api/upload';
import CreateFolderButton from './buttons/CreateFolderButton';
import FileUploadButton from './buttons/FileUploadButton';
import FolderUploadButton from './buttons/FolderUploadButton';

// webkitdirectory属性のビルドエラー回避
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    webkitdirectory?: string;
  }
}

type ContextMenurops = {
  children: React.ReactNode;
  path: string;
  context?: boolean;
  anchorStyle?: SxProps<Theme> | undefined;
  uploads: Uploads;
  important?: boolean;
};

interface ExtendedFile extends File {
  path: string;
}

export const NewMenu = ({ children, path, context, anchorStyle, uploads }: ContextMenurops) => {
  // アップロード用
  const {
    files,
    folders,
    setFiles,
    setFolders,
    addFiles,
    addFolders,
    deleteFile,
    deleteFolder,
    filesUploadMutation,
    foldersUploadMutation,
    resetFiles,
    resetFolders,
  } = uploads;
  // モーダル用
  // コンテキストメニュー用state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // その他state
  const [isDropped, setIsDropped] = useState<boolean>(false);

  // ドロップ関連
  const onDrop = useCallback(async (accepted: File[]) => {
    const targetFiles = accepted
      .filter((item) => (item as ExtendedFile).path.match('/') === null)
      .map((item) => ({ type: 'file' as 'file', path, file: item, isDrop: true }));
    const filesInFolder = accepted.filter(
      (item) => (item as ExtendedFile).path.match('/') !== null,
    );
    const relativePaths = filesInFolder.map((item) =>
      startDirPathSlicer((item as ExtendedFile).path.slice(1)),
    );
    const noMultiRelativePaths = new Set(relativePaths);
    const targetFolders = Array.from(noMultiRelativePaths).map((relativePath) => {
      const files = filesInFolder.filter(
        (fileInFolder) =>
          relativePath === startDirPathSlicer((fileInFolder as ExtendedFile).path.slice(1)),
      );
      const fileNames = files.map((item) => (item as ExtendedFile).path);
      return {
        type: 'folder' as 'folder',
        path,
        name: relativePath,
        fileNames,
        files,
        isDrop: true,
      };
    });
    if (targetFiles.length > 0) {
      setFiles(targetFiles);
    }
    if (targetFolders.length > 0) {
      setFolders(targetFolders);
    }
    setIsDropped(true);
  }, []);

  const { getRootProps } = useDropzone({ onDrop, noClick: true });

  // ファイル・フォルダをドロップした際にuploadProgressesにセット
  useEffect(() => {
    if (isDropped) {
      const dropedFiles = files.filter((item) => item.isDrop);
      const dropedFolders = folders.filter((item) => item.isDrop);
      if (dropedFiles.length > 0) {
        const convertedUnDroppedFiles = dropedFiles.map((item) => ({ ...item, isDrop: false }));
        setFiles(convertedUnDroppedFiles);
        filesUploadMutation.mutate(path);
      }
      if (dropedFolders.length > 0) {
        const convertedUnDroppedFolders = dropedFolders.map((item) => ({ ...item, isDrop: false }));
        setFolders(convertedUnDroppedFolders);
        foldersUploadMutation.mutate(path);
      }
      setIsDropped(false);
    }
  }, [isDropped]);

  return (
    <div>
      {context ? (
        <div onContextMenu={handleClick} {...getRootProps()}>
          {children}
        </div>
      ) : (
        <div onClick={handleClick}>{children}</div>
      )}
      <Menu
        id="basic-menu"
        sx={anchorStyle}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* フォルダ作成ボタン */}
        <CreateFolderButton path={path} />
        <Divider />
        {/* ファイルアップロードボタン */}
        <FileUploadButton
          path={path}
          files={files}
          filesUploadMutation={filesUploadMutation}
          addFiles={addFiles}
          deleteFile={deleteFile}
          resetFiles={resetFiles}
        />
        {/* フォルダアップロードボタン */}
        <FolderUploadButton
          path={path}
          folders={folders}
          foldersUploadMutation={foldersUploadMutation}
          addFolders={addFolders}
          deleteFolder={deleteFolder}
          resetFolders={resetFolders}
        />
      </Menu>
    </div>
  );
};
