import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="big-number">404</span>
      <h1>Ruta no encontrada</h1>
      <p>El recurso solicitado no está disponible.</p>
      <Link className="button button--primary" to="/dashboard">Volver al sistema</Link>
    </main>
  );
}

