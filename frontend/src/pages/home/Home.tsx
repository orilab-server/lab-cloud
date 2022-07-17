import { MainContents } from "../../components/home/MainContents";
import { SideContents } from "../../components/home/SideContents";
import "./home.css";

export const Home = () => {
  return (
    <div className="home-wrapper">
      <SideContents />
      <MainContents />
    </div>
  );
};
