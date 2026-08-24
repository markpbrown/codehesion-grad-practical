import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/login";

function TemporaryHome() {
  return <h1>Login successful</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/categories" element={<TemporaryHome />} />
      </Route>

      <Route
        path="/"
        element={<Navigate to="/categories" replace />}
      />
    </Routes>
  );
}

export default App;