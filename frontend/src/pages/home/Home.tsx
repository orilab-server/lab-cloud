import { Stack } from "@mui/material";
import { useRecoilValue } from "recoil";
import { MainContents } from "../../components/home/MainContents";
import { SideContents } from "../../components/home/SideContents";
import { SignUpComplete } from "../../components/home/SignUpComplete";
import { useUser } from "../../hooks/useUser";
import { userNameState } from "../../store";

export const Home = () => {
  const userName = useRecoilValue(userNameState);
  const { user } = useUser();

  if (userName === null || userName === "") {
    return <SignUpComplete userId={user?.id} />;
  }

  return (
    <Stack direction="row">
      <SideContents />
      <MainContents />
    </Stack>
  );
};
