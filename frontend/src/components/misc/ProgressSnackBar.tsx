import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { MyResponse } from "../../hooks/useDownload";
import { useEffect } from "react";

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
  status: "pending" | "fullfilled" | "suspended" | "finish";
  onSave: () => void;
  cancel: () => void;
};

export const ProgressSnackBar = ({
  progress,
  isOpen,
  text,
  status,
  onSave,
  cancel,
}: ProgressSnackBarProps) => {
  useEffect(() => {
    if (status === "fullfilled") {
      onSave();
    }
  }, [status]);

  if (!isOpen) {
    return null;
  }

  const action = (
    <IconButton sx={{ color: "white" }} onClick={cancel}>
      <Stack alignItems="center">
        <Cancel />
        <Box sx={{ fontSize: 3 }}>中断</Box>
      </Stack>
    </IconButton>
  );
  return (
    <Stack
      sx={{
        bgcolor: "rgba(0,0,0,0.7)",
        px: 3,
        borderRadius: 1,
        color: "white",
      }}
      direction="row"
      alignItems="center"
      spacing={3}
    >
      <CircularProgressWithLabel value={progress} />
      <Box>{text}</Box>
      {status === "suspended" ? null : action}
    </Stack>
  );
};
