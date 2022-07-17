import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { useRecoilValue } from "recoil";
import { NewMenu } from "../../components/home/NewMenu";
import { useMkRmRequest } from "../../hooks/useMkRmRequest";
import { pathState } from "../../store";

export const SideContents = () => {
  const path = useRecoilValue(pathState);
  const { requestMutation } = useMkRmRequest(path);

  return (
    <aside id="side-contents">
      <NewMenu requestMutation={requestMutation} path={path}>
        <Fab color="primary" variant="extended">
          <AddIcon sx={{ mr: 1, ml: 1 }} fontSize="large" />
          <strong style={{ marginRight: "1rem" }}>新規</strong>
        </Fab>
      </NewMenu>
    </aside>
  );
};
