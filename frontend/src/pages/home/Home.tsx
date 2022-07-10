import { ArrowBack, Folder, InsertDriveFile } from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { ContextMenu } from "../../components/home/ContextMenu";
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
  const dirs = path.split("/");

  const moveDir = (newPath: string) => {
    location.href = `http://localhost:3000/?path=${newPath}`;
  };

  const openMyContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
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
            <ListItem onClick={() => moveDir(prevPath)} button>
              <ListItemIcon>
                <ArrowBack />
              </ListItemIcon>
              <ListItemText className="list-item-text" primary="戻る" />
            </ListItem>
          ) : null}
          <div className="current-path-text">
            現在のパス :{" "}
            {dirs.map((dir, index) => {
              return (
                <React.Fragment key={dir}>
                  <span className="" style={{ color: "royalblue" }}>
                    {dir}
                  </span>
                  <span className="" style={{ color: "rgba(0,0,0,0.5)" }}>
                    {index > 0 && index + 1 !== dirs.length ? " ▶︎ " : null}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
          {items.map((item) => {
            if (item.type === "dir") {
              return (
                <ContextMenu key={item.path}>
                  <ListItem
                    onContextMenu={openMyContextMenu}
                    onDoubleClick={() => moveDir(item.path)}
                    className="list-item"
                    button
                  >
                    <ListItemIcon>
                      <Folder />
                    </ListItemIcon>
                    <ListItemText
                      className="list-item-text"
                      primary={slieceEndFileName(item.path)}
                    />
                  </ListItem>
                </ContextMenu>
              );
            }
            return (
              <ContextMenu key={item.path}>
                <ListItem
                  onContextMenu={openMyContextMenu}
                  onDoubleClick={() => console.log("ダブルクリック: file")}
                  className="list-item"
                  button
                >
                  <ListItemIcon>
                    <InsertDriveFile />
                  </ListItemIcon>
                  <ListItemText
                    className="list-item-text"
                    primary={slieceEndFileName(item.path)}
                  />
                </ListItem>
              </ContextMenu>
            );
          })}
        </List>
      </main>
    </div>
  );
};
