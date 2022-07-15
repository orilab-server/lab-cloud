import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, Stack } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

type ShareModalProps = {
  button: React.ReactNode;
  children: React.ReactNode;
  sendText?: string;
  onSend?: () => void;
};

export const ShareModal = ({
  button,
  children,
  sendText,
  onSend,
}: ShareModalProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClick = () => {
    onSend && onSend();
    handleClose();
  };

  return (
    <div>
      <div onClick={handleOpen}>{button}</div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {children}
          <Stack direction="row" spacing={2}>
            {sendText && (
              <Button size="medium" variant="contained" onClick={handleClick}>
                {sendText}
              </Button>
            )}
            <Button onClick={handleClose}>閉じる</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};
