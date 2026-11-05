import { useState } from 'react';
import { api } from '../api.js';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState(null);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setFeedback(null);
    try {
      const response = await api('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setFeedback({ type: 'success', message: response.message });
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: [error.message, ...(error.details || [])].join(' '),
      });
    }
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <span className="eyebrow eyebrow--dark">VALIDACIÓN DE ENTRADAS</span>
          <h1>Formulario seguro</h1>
          <p>La API valida longitud, formato y patrones peligrosos.</p>
        </div>
      </header>
      <section className="panel form-panel">
        <form id="contact-form" onSubmit={submit}>
          <label htmlFor="contact-name">Nombre</label>
          <input id="contact-name" name="name" value={form.name} onChange={update} required />
          <label htmlFor="contact-email">Correo</label>
          <input id="contact-email" name="email" type="email" value={form.email} onChange={update} required />
          <label htmlFor="contact-message">Mensaje</label>
          <textarea id="contact-message" name="message" rows="6" value={form.message} onChange={update} required />
          {feedback && (
            <div
              id="form-feedback"
              className={`alert alert--${feedback.type}`}
              role="alert"
            >
              {feedback.message}
            </div>
          )}
          <button id="contact-submit" className="button button--primary">Enviar formulario</button>
        </form>
        <aside className="security-note">
          <span className="security-note__icon">⌁</span>
          <h3>Control aplicado</h3>
          <p>
            La validación principal ocurre en el backend. La interfaz no se considera una
            frontera de seguridad.
          </p>
        </aside>
      </section>
    </div>
  );
}

