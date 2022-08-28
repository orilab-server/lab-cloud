import { Box } from "@mui/material";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useUser } from "./hooks/useUser";
import { Login } from "./pages/auth/Login";
import { RouteGuard } from "./pages/auth/RouteGuard";
import { Home } from "./pages/home/Home";
import { sessionState } from "./store";
import { getCookie } from "./utils/cookie";

function App() {
  const setSession = useSetRecoilState(sessionState);
  useUser();

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
      <Route
        path="*"
        element={
          <Box
            sx={{
              fontSize: 80,
              fontWeight: "bold",
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            404 Not Found
          </Box>
        }
      />
    </Routes>
  );
}

export default App;
