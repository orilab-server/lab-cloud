import { Stack } from "@mui/material";
import { useRecoilValue } from "recoil";
import { MainContents } from "../../components/home/MainContents";
import { SideContents } from "../../components/home/SideContents";
import { SignUpComplete } from "../../components/home/SignUpComplete";
import { useUser } from "../../hooks/useUser";
import { isTemporaryState } from "../../store";

export const Home = () => {
  const isTemporary = useRecoilValue(isTemporaryState);
  useUser();

  if (isTemporary) {
    return <SignUpComplete />;
  }

  return (
    <Stack direction="row">
      <SideContents />
      <MainContents />
    </Stack>
  );
};
