import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Container,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRecoilState, useRecoilValue } from "recoil";
import { NewMenu } from "../../components/home/NewMenu";
import { useAuth } from "../../hooks/useAuth";
import { useMkRmRequest } from "../../hooks/useMkRmRequest";
import { pathState, topDirsState, userNameState } from "../../store";
import React from "react";
import { endFilenameSlicer } from "../../utils/slice";

const style = {
  width: "100%",
  paddingTop: 10,
  bgcolor: "background.paper",
};

export const SideContents = () => {
  const userName = useRecoilValue(userNameState);
  const [path, setPath] = useRecoilState(pathState);
  const topDirs = useRecoilValue(topDirsState);
  const { signOut } = useAuth();
  const { requestMutation } = useMkRmRequest(path);

  return (
    <Container
      sx={{
        flex: 1,
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          width: 200,
          pt: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} pb={3}>
          <Avatar sx={{ bgcolor: "green" }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h6" component="div">
            {userName}
          </Typography>
        </Stack>
        <NewMenu requestMutation={requestMutation} path={path}>
          <Fab
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
            }}
            color="primary"
            variant="extended"
          >
            <AddIcon sx={{ mr: 1, ml: 1 }} />
            <strong style={{ marginRight: "1rem" }}>新規</strong>
          </Fab>
        </NewMenu>
        <Fab
          sx={{
            width: "100%",
            top: 30,
            display: "flex",
            justifyContent: "start",
          }}
          onClick={signOut}
          color="secondary"
          variant="extended"
        >
          <LogoutIcon sx={{ mr: 1, ml: 1 }} />
          <strong style={{ marginRight: "1rem" }}>ログアウト</strong>
        </Fab>
        <List sx={style} component="nav">
          <ListItem>
            <ListItemText sx={{ color: "rgba(0,0,0,0.5)" }}>Share</ListItemText>
          </ListItem>
          {topDirs.map((item) => (
            <React.Fragment key={item}>
              <ListItem button onClick={() => setPath(item)}>
                <ListItemText primary={endFilenameSlicer(item)} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};
