import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { MainContents } from "../../components/home/MainContents";
import { SideContents } from "../../components/home/SideContents";
import { SignUpComplete } from "../../components/home/SignUpComplete";
import { useUser } from "../../hooks/useUser";
import { supabase } from "../../lib/supabase";
import { userNameState } from "../../store";
import "./home.css";

export const Home = () => {
  const userName = useRecoilValue(userNameState);
  const { user } = useUser();

  if (userName === null || userName === "") {
    return <SignUpComplete userId={user?.id} />;
  }

  return (
    <div className="home-wrapper">
      <SideContents />
      <MainContents />
    </div>
  );
};
