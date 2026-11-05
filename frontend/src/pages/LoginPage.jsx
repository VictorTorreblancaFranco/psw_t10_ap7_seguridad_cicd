import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-visual">
        <div className="brand">
          <span className="brand__mark">SF</span>
          <div>
            <strong>SecureFlow</strong>
            <small>Laboratorio DevSecOps</small>
          </div>
        </div>
        <div className="hero-copy">
          <span className="eyebrow">OWASP · SELENIUM · JENKINS</span>
          <h1>Seguridad comprobable en cada cambio.</h1>
          <p>
            Aplicación académica para demostrar controles funcionales, análisis
            DAST pasivo y automatización continua.
          </p>
          <div className="security-points">
            <span>✓ Autenticación controlada</span>
            <span>✓ Rutas protegidas por rol</span>
            <span>✓ Validación de entradas</span>
          </div>
        </div>
      </section>
      <section className="login-panel">
        <form className="auth-card" onSubmit={submit} data-testid="login-form">
          <span className="eyebrow eyebrow--dark">ACCESO AL SISTEMA</span>
          <h2>Bienvenido</h2>
          <p>Ingresa con una cuenta autorizada.</p>

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <div id="login-error" className="alert alert--error" role="alert">{error}</div>}

          <button id="login-submit" className="button button--primary" disabled={loading}>
            {loading ? 'Verificando…' : 'Iniciar sesión'}
          </button>

          <div className="demo-credentials">
            <strong>Cuentas del laboratorio</strong>
            <span>USER: user@demo.local / User123!</span>
            <span>ADMIN: admin@demo.local / Admin123!</span>
          </div>
        </form>
      </section>
    </div>
  );
}

