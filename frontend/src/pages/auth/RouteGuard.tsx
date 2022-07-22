import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type RouteGuardProps = {
  children: JSX.Element;
};

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const user = supabase.auth.user();
  const routerLocation = useLocation();

  if (!user) {
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
