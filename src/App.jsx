import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/Register";

function TemporaryHome() {
  return <h1>Categories coming next</h1>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/categories"
            element={<TemporaryHome />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />
        </Route>
      </Route>

      <Route
        path="/"
        element={<Navigate to="/categories" replace />}
      />
    </Routes>
  );
}