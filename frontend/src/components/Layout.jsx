import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function closeSession() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand brand--sidebar">
            <span className="brand__mark">SF</span>
            <div>
              <strong>SecureFlow</strong>
              <small>DevSecOps Lab</small>
            </div>
          </div>
          <nav aria-label="Navegación principal">
            <NavLink to="/dashboard">Panel</NavLink>
            <NavLink to="/contact">Formulario seguro</NavLink>
            {user?.role === 'ADMIN' && <NavLink to="/admin">Administración</NavLink>}
          </nav>
        </div>
        <div className="profile-card">
          <span className="avatar">{user?.name?.slice(0, 1)}</span>
          <div>
            <strong>{user?.name}</strong>
            <small>{user?.role}</small>
          </div>
          <button type="button" className="button button--ghost" onClick={closeSession}>
            Salir
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

