import {NavLink, Outlet, useNavigate,} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="header">
        <NavLink to="/categories" className="brand">
          eDeaf Admin
        </NavLink>

        <nav className="navigation">
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Categories
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Invite user
          </NavLink>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}