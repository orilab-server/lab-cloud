import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Close } from "@mui/icons-material";
import { getMimeType } from "../../utils/mime";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  width: "80vw",
  height: "80vh",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: 24,
};

type FilePreviewModalProps = {
  button: React.ReactNode;
  fileName: string;
  onFetchFile: () => Promise<Blob>;
};

export const FilePreviewModal = ({
  button,
  fileName,
  onFetchFile,
}: FilePreviewModalProps) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string>("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (open) {
      onFetchFile().then(async (data) => {
        const file = new File([data], fileName, {
          type: getMimeType(fileName),
        });
        const url = URL.createObjectURL(file);
        setUrl(url);
      });
    }
    if (!open) {
      if (url !== "") {
        URL.revokeObjectURL(url);
        setUrl("");
      }
    }
  }, [open]);

  return (
    <div>
      <div onDoubleClick={handleOpen}>{button}</div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {url === "" ? null : <embed src={url} width="100%" height="100%" />}
          <Close
            onClick={handleClose}
            fontSize="large"
            sx={{
              position: "absolute",
              top: -15,
              right: -15,
              bgcolor: "black",
              borderRadius: "50%",
              color: "white",
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};
