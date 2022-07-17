import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { pathState } from "../store";
import { Storage } from "../types/storage";

export const useStorage = () => {
  const [items, setItems] = useState<Storage["items"]>([]);
  const [isHome, setIsHome] = useState<boolean>(true);
  const [path, setPath] = useRecoilState(pathState);

  const moveDir = (newPath: string) => {
    setPath(newPath);
  };

  const openMyContextMenu: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.preventDefault();
  };

  const query = useQuery(["storage", { path }], async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/?path=${path}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    await res.json().then((data) => {
      setIsHome(data.ishome);
      const parseData = JSON.parse(data.items) as Storage["items"];
      const currentDir = parseData[0].path.slice(
        0,
        parseData[0].path.lastIndexOf("/")
      );
      setPath(currentDir);
      setItems(
        parseData.map((item) => {
          return {
            path: item.path,
            type: item.type,
          };
        })
      );
    });
  });

  return {
    items,
    isHome,
    query,
    moveDir,
    openMyContextMenu,
  };
};
