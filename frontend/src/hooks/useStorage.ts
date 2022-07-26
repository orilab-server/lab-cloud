import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { notifyState, pathState, topDirsState } from "../store";
import { Storage } from "../types/storage";

export const useStorage = () => {
  const [items, setItems] = useState<Storage["items"]>([]);
  const [isHome, setIsHome] = useState<boolean>(true);
  const [baseDir, setBaseDir] = useState<string>("");
  const [path, setPath] = useRecoilState(pathState);
  const setTopDirs = useSetRecoilState(topDirsState);
  const setNotify = useSetRecoilState(notifyState);
  const url = new URL(location.href);
  const params = url.searchParams;
  const paramPath = params.get("path");

  const moveDir = (newPath: string) => {
    setPath(newPath);
  };

  const copyLink = (path: string) => {
    const url = `${import.meta.env.VITE_CLIENT_URL}/?path=${path}`;
    navigator.clipboard.writeText(url);
    setNotify({ severity: "info", text: "コピーしました！" });
  };

  const openMyContextMenu: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.preventDefault();
  };

  const query = useQuery(["storage", { path }], async () => {
    if (paramPath !== null) {
      localStorage.setItem("prev_path", paramPath);
      location.href = import.meta.env.VITE_CLIENT_URL;
      return;
    }
    const prevPath = localStorage.getItem("prev_path");
    const correctPath = prevPath || path;
    if (prevPath !== null) {
      localStorage.removeItem("prev_path");
    }
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/home/?path=${correctPath}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = res;
    setIsHome(data.ishome);
    if (data.items === "null") {
      setItems([]);
      return;
    }
    const parseData = JSON.parse(data.items) as Storage["items"];
    const currentDir = parseData[0].path.slice(
      0,
      parseData[0].path.lastIndexOf("/")
    );
    setBaseDir(data.basedir);
    setPath(currentDir);
    setTopDirs(data.topdirs);
    setItems(
      parseData.map((item) => {
        return {
          path: item.path,
          type: item.type,
        };
      })
    );
  });

  return {
    items,
    isHome,
    baseDir,
    query,
    moveDir,
    copyLink,
    openMyContextMenu,
  };
};
