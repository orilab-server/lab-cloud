import { ArrowBack, Folder, InsertDriveFile } from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { ContextMenu } from "./ContextMenu";
import { LoadingSpinner } from "../misc/LoadingSpinner";
import { useMkRmRequest } from "../../hooks/useMkRmRequest";
import { useStorage } from "../../hooks/useStorage";
import { endFilenameSlicer } from "../../utils/slice";
import { useRecoilValue } from "recoil";
import { pathState } from "../../store";

export const MainContents = () => {
  const { items, isHome, query, moveDir, openMyContextMenu } = useStorage();
  const path = useRecoilValue(pathState);
  const { requestMutation } = useMkRmRequest(path);
  const prevPath = path.slice(0, path.lastIndexOf("/"));
  const dirs = path.split("/");

  if (query.isLoading) {
    return <LoadingSpinner />;
  }

  return (
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
              <React.Fragment key={dir + index}>
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
              <ContextMenu
                path={path}
                itemName={endFilenameSlicer(item.path)}
                itemType="dir"
                requestMutation={requestMutation}
                key={item.path}
              >
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
                    primary={endFilenameSlicer(item.path)}
                  />
                </ListItem>
              </ContextMenu>
            );
          }
          return (
            <ContextMenu
              path={path}
              itemName={endFilenameSlicer(item.path)}
              itemType="file"
              requestMutation={requestMutation}
              key={item.path}
            >
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
                  primary={endFilenameSlicer(item.path)}
                />
              </ListItem>
            </ContextMenu>
          );
        })}
      </List>
    </main>
  );
};
