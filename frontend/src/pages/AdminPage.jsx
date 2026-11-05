import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/stats').then(setStats).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <span className="eyebrow eyebrow--dark">ACCESO RBAC</span>
          <h1>Módulo administrativo</h1>
          <p>Visible únicamente para cuentas con rol ADMIN.</p>
        </div>
        <span id="admin-authorized" className="status-pill">✓ Acceso autorizado</span>
      </header>
      {error && <div className="alert alert--error">{error}</div>}
      <section className="metric-grid">
        <article className="metric-card">
          <strong>Usuarios registrados</strong>
          <span className="big-number">{stats?.users ?? '—'}</span>
        </article>
        <article className="metric-card">
          <strong>Controles auditados</strong>
          <span className="big-number">{stats?.audits ?? '—'}</span>
        </article>
        <article className="metric-card">
          <strong>Política aplicada</strong>
          <p>{stats?.status || 'Verificando…'}</p>
        </article>
      </section>
    </div>
  );
}

