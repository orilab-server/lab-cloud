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
      sx={{ width: "auto", height: "100%", backgroundColor: "rgba(0,0,0,0.1)" }}
    >
      <Box
        sx={{ width: "100%", pt: 5, display: "flex", flexDirection: "column" }}
      >
        <NewMenu requestMutation={requestMutation} path={path}>
          <Fab
            sx={{
              mb: 3,
              width: "100%",
              textAlign: "left",
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
          sx={{ mt: 3 }}
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
