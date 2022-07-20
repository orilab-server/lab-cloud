import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type RouteGuardProps = {
  children: JSX.Element;
};

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const user = supabase.auth.user();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
