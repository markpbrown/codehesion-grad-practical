import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import CategoryPage from "./pages/Categories";
import HomePage from "./pages/Home";
import LoginPage from "./pages/login";
import NotFoundPage from "./pages/NotFound";
import RegisterPage from "./pages/Register";
import WordPage from "./pages/Word";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/categories"
            element={<HomePage />}
          />

          <Route
            path="/categories/:categoryId"
            element={<CategoryPage />}
          />

          <Route
            path="/categories/:categoryId/words/:wordId"
            element={<WordPage />}
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

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}