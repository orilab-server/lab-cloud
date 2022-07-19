import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import { ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { Download } from "@mui/icons-material";
import { ShareModal } from "../misc/Modal";
import { UseMutationResult } from "react-query";
import { MkRmRequest } from "../../types/request";

type ContextMenurops = {
  path: string;
  itemName: string;
  itemType: "dir" | "file";
  children: React.ReactNode;
  requestMutation: UseMutationResult<void, unknown, MkRmRequest, unknown>;
  downloadMutation: UseMutationResult<
    void,
    unknown,
    {
      name: string;
      type: "dir" | "file";
    },
    unknown
  >;
};

export const ContextMenu = ({
  path,
  itemName,
  itemType,
  children,
  requestMutation,
  downloadMutation,
}: ContextMenurops) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const requestBody =
    itemType === "dir"
      ? { requestType: "rmdir", dirName: itemName }
      : { requestType: "rmfile", fileName: itemName };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div onContextMenu={handleClick}>{children}</div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() =>
            downloadMutation.mutate({ name: itemName, type: itemType })
          }
        >
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>ダウンロード</ListItemText>
        </MenuItem>
        <ShareModal
          onSend={() => requestMutation.mutate(requestBody)}
          sendText="削除"
          button={
            <MenuItem>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>削除</ListItemText>
            </MenuItem>
          }
        >
          <Stack sx={{ py: 2 }} spacing={2} alignItems="center">
            <div>
              以下の{itemType === "dir" ? "フォルダ" : "ファイル"}
              を削除しますか？
            </div>
            <Typography variant="h6">{itemName}</Typography>
          </Stack>
        </ShareModal>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>リンクをコピー</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
