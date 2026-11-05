import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from './app.js';

const app = createApp();

describe('API de seguridad', () => {
  it('rechaza credenciales inválidas con un mensaje genérico', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@demo.local', password: 'incorrecta' });

    assert.equal(response.status, 401);
    assert.equal(response.body.message, 'Credenciales incorrectas.');
  });

  it('protege el recurso administrativo sin token', async () => {
    const response = await request(app).get('/api/admin/stats');
    assert.equal(response.status, 401);
  });

  it('impide que USER consuma un recurso ADMIN', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@demo.local', password: 'User123!' });

    const response = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${login.body.token}`);

    assert.equal(response.status, 403);
  });
});
