import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useRecoilValue } from "recoil";
import { notifyState } from "../../store";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const NotifyBar = () => {
  const [open, setOpen] = useState(false);
  const notify = useRecoilValue(notifyState);

  useEffect(() => {
    if (notify !== "") {
      setOpen(true);
    }
  }, [notify]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
        {notify}
      </Alert>
    </Snackbar>
  );
};
