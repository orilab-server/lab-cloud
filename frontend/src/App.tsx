import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { RouteGuard } from "./pages/auth/RouteGuard";
import { Home } from "./pages/home/Home";

function App() {
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
