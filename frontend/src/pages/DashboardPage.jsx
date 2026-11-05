import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div>
      <header className="page-header">
        <div>
          <span className="eyebrow eyebrow--dark">CENTRO DE CONTROL</span>
          <h1>Hola, {user?.name}</h1>
          <p>Estado general de los controles del laboratorio.</p>
        </div>
        <span className="status-pill">● Sistema operativo</span>
      </header>

      {location.state?.denied && (
        <div id="access-denied" className="alert alert--warning" role="alert">
          Acceso restringido: tu rol no permite abrir el módulo administrativo.
        </div>
      )}

      <section className="metric-grid">
        <article className="metric-card">
          <span className="metric-card__icon">01</span>
          <strong>Autenticación</strong>
          <p>Token firmado con expiración de 30 minutos.</p>
          <span className="tag tag--green">Activo</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon">02</span>
          <strong>Autorización</strong>
          <p>Control de acceso tanto en interfaz como en API.</p>
          <span className="tag tag--green">Activo</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon">03</span>
          <strong>Validación</strong>
          <p>Filtrado de entradas peligrosas en el backend.</p>
          <span className="tag tag--green">Activo</span>
        </article>
      </section>

      <section className="panel">
        <div>
          <span className="eyebrow eyebrow--dark">FLUJO DEVSECOPS</span>
          <h2>Del código a la evidencia</h2>
          <p>Cada cambio pasa por controles reproducibles antes de considerarse válido.</p>
        </div>
        <div className="pipeline-flow" aria-label="Etapas del pipeline">
          {['GitHub', 'Build', 'OWASP ZAP', 'Selenium', 'Resultado'].map((stage, index) => (
            <div className="pipeline-stage" key={stage}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{stage}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

