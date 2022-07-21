import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { Container, Fab } from "@mui/material";
import { Box } from "@mui/system";
import { useRecoilValue } from "recoil";
import { NewMenu } from "../../components/home/NewMenu";
import { useAuth } from "../../hooks/useAuth";
import { useMkRmRequest } from "../../hooks/useMkRmRequest";
import { pathState } from "../../store";

export const SideContents = () => {
  const path = useRecoilValue(pathState);
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
          // width: "100%",
          pt: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
      </Box>
    </Container>
  );
};
