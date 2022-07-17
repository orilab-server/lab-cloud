import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { startDirPathSlicer } from "../utils/slice";

type Folder = {
  name: string;
  fileNames: string[];
  files: File[];
};

export const useUpload = (path: string) => {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const queryClient = useQueryClient();

  const handleOnAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles([...files, ...event.target.files]);
  };

  const handleOnDeleteFile = (name: string) => {
    const newFiles = files.filter((file) => file.name !== name);
    setFiles(newFiles);
  };

  const handleOnAddFolder = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = [...event.target.files];
    const fileNames = files.map((file) => file.webkitRelativePath);
    setFolders([
      ...folders,
      {
        name: startDirPathSlicer(files[0].webkitRelativePath),
        fileNames,
        files,
      },
    ]);
  };

  const handleOnDeleteFolder = (name: string) => {
    const newFolders = folders.filter((folder) => folder.name !== name);
    setFolders(newFolders);
  };

  const fileMutation = useMutation(async () => {
    if (files.length === 0) {
      alert("ファイルが選択されていません");
      return;
    }
    const formData = new FormData();
    formData.append("type", "upload");
    formData.append("requestType", "files");
    for (const file of files) {
      formData.append("files", file);
    }
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/?path=${path}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
    await queryClient.invalidateQueries("storage");
    setFiles([]);
  });

  const folderMutation = useMutation(async () => {
    if (folders.length === 0) {
      alert("フォルダが選択されていません");
      return;
    }
    const formData = new FormData();
    formData.append("type", "upload");
    formData.append("requestType", "dirs");
    for (const folder of folders) {
      folder.files.forEach((file) => formData.append("files", file));
      formData.append("filePaths", folder.fileNames.join(" // "));
    }
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/?path=${path}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
    await queryClient.invalidateQueries("storage");
    setFolders([]);
  });

  return {
    files,
    folders,
    fileMutation,
    folderMutation,
    handleOnAddFile,
    handleOnDeleteFile,
    handleOnAddFolder,
    handleOnDeleteFolder,
  };
};
