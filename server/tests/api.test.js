process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/app');

describe('health', () => {
  it('GET /healthz -> 200', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /readyz -> 503 when Mongo is not connected', async () => {
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(503);
  });
});

describe('validation + auth middleware', () => {
  it('rejects a bad register body with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'nope', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it('blocks protected routes without a token (401)', async () => {
    const res = await request(app).get('/api/orgs');
    expect(res.status).toBe(401);
  });

  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(app).get('/api/nothing');
    expect(res.status).toBe(404);
  });
});
