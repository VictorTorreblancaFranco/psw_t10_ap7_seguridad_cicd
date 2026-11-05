import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import express from 'express';
import { authenticate, createToken, requireRole } from './auth.js';
import { publicUser, users } from './users.js';
import { validateContact } from './validation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

export function createApp() {
  const app = express();

  // Configuración inicial del laboratorio: se mantiene X-Powered-By y se
  // omiten algunas cabeceras para que ZAP genere hallazgos pasivos reparables.
  app.use(express.json({ limit: '20kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'UP', service: 'psw-ap7-security-lab' });
  });

  app.post('/api/auth/login', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const user = users.find((candidate) => candidate.email === email);
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!valid) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    return res.json({ token: createToken(user), user: publicUser(user) });
  });

  app.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ user: req.user });
  });

  app.get('/api/admin/stats', authenticate, requireRole('ADMIN'), (_req, res) => {
    res.json({ users: users.length, audits: 3, status: 'Protegido por rol ADMIN' });
  });

  app.post('/api/contact', authenticate, (req, res) => {
    const result = validateContact(req.body);
    if (result.errors.length > 0) {
      return res.status(400).json({
        message: 'Revisa los datos ingresados.',
        errors: result.errors,
      });
    }

    return res.status(201).json({
      message: 'Formulario registrado correctamente.',
      reference: `MSG-${Date.now()}`,
    });
  });

  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });

  app.use((error, _req, res, _next) => {
    console.error('Error controlado:', error.message);
    res.status(500).json({ message: 'Ocurrió un error interno.' });
  });

  return app;
}

