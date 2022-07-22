import { ArrowBack, Folder } from "@mui/icons-material";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { ContextMenu } from "./ContextMenu";
import { LoadingSpinner } from "../misc/LoadingSpinner";
import { useMkRmRequest } from "../../hooks/useMkRmRequest";
import { useStorage } from "../../hooks/useStorage";
import { endFilenameSlicer, relativePathSlicer } from "../../utils/slice";
import { useRecoilValue } from "recoil";
import { pathState } from "../../store";
import { useDownload } from "../../hooks/useDownload";
import { ProgressSnackBar } from "../misc/ProgressSnackBar";
import { FileIcons } from "../misc/FileIcons";
import { FilePreviewModal } from "../misc/FilePreview";

export const MainContents = () => {
  const path = useRecoilValue(pathState);
  const {
    items,
    isHome,
    baseDir,
    query,
    moveDir,
    copyLink,
    openMyContextMenu,
  } = useStorage();
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
  const relativePath = relativePathSlicer(path, baseDir);
  const dirs = relativePath.split("/");
  const relativeDirs = relativePath.split("/");

  if (query.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container sx={{ flex: 4, height: "100%", pt: 3 }}>
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
        <Box py={2}>
          現在のパス :{" "}
          <Typography component="span" sx={{ color: "rgba(0,0,0,0.5)" }}>
            /{" "}
            <Typography
              component="span"
              onClick={() => moveDir(baseDir)}
              sx={{
                color: "royalblue",
                borderBottom: "1px solid royalblue",
                cursor: "pointer",
              }}
            >
              Share
            </Typography>{" "}
            /{" "}
          </Typography>
          {dirs.map((dir, index) => {
            let targetPath = "/";
            if (relativePath.match(dir)) {
              targetPath = relativeDirs
                .slice(0, relativeDirs.indexOf(dir) + 1)
                .join("/");
            }
            return (
              <React.Fragment key={dir + index}>
                <Typography
                  component="span"
                  onClick={() => moveDir(baseDir + targetPath)}
                  sx={{
                    color: "royalblue",
                    borderBottom: "1px solid royalblue",
                    cursor: "pointer",
                  }}
                >
                  {dir}
                </Typography>
                <Typography component="span" sx={{ color: "rgba(0,0,0,0.5)" }}>
                  {index > 0 && index + 1 !== dirs.length ? " / " : null}
                </Typography>
              </React.Fragment>
            );
          })}
        </Box>
        {items.map((item) => {
          if (item.type === "dir") {
            return (
              <ContextMenu
                itemName={endFilenameSlicer(item.path)}
                itemType="dir"
                copyLink={() => copyLink(item.path)}
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
              itemName={endFilenameSlicer(item.path)}
              itemType="file"
              copyLink={() => copyLink(path)}
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
    </Container>
  );
};
