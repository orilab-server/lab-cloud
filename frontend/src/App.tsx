import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Login } from "./pages/auth/Login";
import { RouteGuard } from "./pages/auth/RouteGuard";
import { Home } from "./pages/home/Home";
import { sessionState } from "./store";
import { getCookie } from "./utils/cookie";

function App() {
  const setSession = useSetRecoilState(sessionState);

  useEffect(() => {
    const session = getCookie("mysession");
    if (session === "") {
      setSession(null);
    } else {
      setSession(session);
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RouteGuard>
            <Home />
          </RouteGuard>
        }
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
