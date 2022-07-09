import { ArrowBack, Folder, InsertDriveFile } from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { slieceEndFileName } from "../../utils/slice";
import "./home.css";

type Storage = {
  items: {
    path: string;
    type: string;
  }[];
  ishome: boolean;
};

export const Home = () => {
  const [items, setItems] = useState<Storage["items"]>([]);
  const [isHome, setIsHome] = useState<boolean>(true);
  const param = new URL(location.href).searchParams;
  const dirPath = param.get("path");
  const [path, setPath] = useState<string>(dirPath || "/");
  const prevPath = path.slice(0, path.lastIndexOf("/"));

  const moveDir = (newPath: string) => {
    location.href = `http://localhost:3000/?path=${newPath}`;
  };

  const query = useQuery(["path", { path }], async () => {
    const res = await fetch(`http://localhost:8000/?path=${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await res.json().then((data) => {
      setIsHome(data.ishome);
      const parseData = JSON.parse(data.items) as Storage["items"];

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

  if (query.isLoading) {
    return <div>...ローディング中</div>;
  }

  return (
    <div className="home-wrapper">
      <aside id="side-contents">
        <div>サイドのコンテンツです</div>
      </aside>
      <main id="main-contents">
        <List>
          {!isHome && items.length > 0 ? (
            <ListItem
              className="list-item back"
              onClick={() => moveDir(prevPath)}
            >
              <ListItemIcon>
                <ArrowBack />
              </ListItemIcon>
              <ListItemText className="list-item-text" primary="戻る" />
            </ListItem>
          ) : null}
          <div className="current-path-text">現在のパス : {path}</div>
          {items.map((item) => {
            if (item.type === "dir") {
              return (
                <ListItem
                  key={item.path}
                  onContextMenu={() => console.log("右クリック : dir")}
                  onDoubleClick={() => moveDir(item.path)}
                  className="list-item"
                >
                  <ListItemIcon>
                    <Folder />
                  </ListItemIcon>
                  <ListItemText
                    className="list-item-text"
                    primary={slieceEndFileName(item.path)}
                  />
                </ListItem>
              );
            }
            return (
              <ListItem
                key={item.path}
                onContextMenu={() => console.log("右クリック : file")}
                onDoubleClick={() => console.log("ダブルクリック: file")}
                className="list-item"
              >
                <ListItemIcon>
                  <InsertDriveFile />
                </ListItemIcon>
                <ListItemText
                  className="list-item-text"
                  primary={slieceEndFileName(item.path)}
                />
              </ListItem>
            );
          })}
        </List>
      </main>
    </div>
  );
};
