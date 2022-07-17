import React, { useEffect, useState } from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton, Snackbar, Stack } from "@mui/material";
import { Cancel } from "@mui/icons-material";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="white"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

type ProgressSnackBarProps = {
  progress: number;
  isOpen: boolean;
  text: string;
  suspend?: () => void;
};

export const ProgressSnackBar = ({
  progress,
  isOpen,
  text,
  suspend,
}: ProgressSnackBarProps) => {
  const action = (
    <IconButton sx={{ color: "white" }} onClick={suspend}>
      <Cancel />
    </IconButton>
  );
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isOpen}
      action={action}
      message={
        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgressWithLabel value={progress} />
          <Box>{text}</Box>
        </Stack>
      }
    />
  );
};
