import { Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { sessionState } from "../../store";

type RouteGuardProps = {
  children: JSX.Element;
};

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const routerLocation = useLocation();
  const session = useRecoilValue(sessionState);

  if (session === null) {
    const url = new URL(location.href);
    const params = url.searchParams;
    const path = params.get("path");
    if (path !== null) {
      localStorage.setItem("prev_path", path);
    }
    return <Navigate to="/login" state={{ from: routerLocation }} replace />;
  }

  return children;
};
