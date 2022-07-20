import { ArrowBack, Folder } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import React from "react";
import { ContextMenu } from "./ContextMenu";
import { LoadingSpinner } from "../misc/LoadingSpinner";
import { useMkRmRequest } from "../../hooks/useMkRmRequest";
import { useStorage } from "../../hooks/useStorage";
import { endFilenameSlicer } from "../../utils/slice";
import { useRecoilValue } from "recoil";
import { pathState } from "../../store";
import { useDownload } from "../../hooks/useDownload";
import { ProgressSnackBar } from "../misc/ProgressSnackBar";
import { FileIcons } from "../misc/FileIcons";
import { FilePreviewModal } from "../misc/FilePreview";

export const MainContents = () => {
  const path = useRecoilValue(pathState);
  const { items, isHome, query, moveDir, openMyContextMenu } = useStorage();
  const { requestMutation } = useMkRmRequest(path);
  const {
    myProgress,
    responses,
    handleCancel,
    saveFile,
    getPreviewFile,
    downloadMutation,
  } = useDownload(path);
  const prevPath = path.slice(0, path.lastIndexOf("/"));
  const dirs = path.split("/");

  if (query.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main id="main-contents">
      <Stack
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
        spacing={1}
      >
        {responses.map((response) => {
          const { progress, status, start, text } =
            myProgress[
              myProgress.findIndex((item) => item.name === response.name)
            ];
          return (
            <ProgressSnackBar
              key={response.name}
              progress={progress}
              isOpen={start}
              text={text}
              status={status}
              onSave={() => saveFile(response)}
              cancel={() => handleCancel(response.name)}
            />
          );
        })}
      </Stack>
      <List>
        {!isHome ? (
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
                downloadMutation={downloadMutation}
                key={item.path}
              >
                <ListItem
                  onContextMenu={openMyContextMenu}
                  onDoubleClick={() => moveDir(item.path)}
                  className="list-item"
                  button
                >
                  <ListItemIcon>
                    <Folder sx={{ color: "steelblue" }} />
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
              downloadMutation={downloadMutation}
              key={item.path}
            >
              <FilePreviewModal
                onFetchFile={() => getPreviewFile(endFilenameSlicer(item.path))}
                fileName={endFilenameSlicer(item.path)}
                button={
                  <ListItem
                    onContextMenu={openMyContextMenu}
                    className="list-item"
                    button
                  >
                    <ListItemIcon>
                      <FileIcons fileName={endFilenameSlicer(item.path)} />
                    </ListItemIcon>
                    <ListItemText
                      className="list-item-text"
                      primary={endFilenameSlicer(item.path)}
                    />
                  </ListItem>
                }
              />
            </ContextMenu>
          );
        })}
      </List>
    </main>
  );
};
