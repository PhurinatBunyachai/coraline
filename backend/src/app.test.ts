import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app';
import { ACTIONS } from './models/action.model';

describe('GET /api/game/bot-action', () => {
  it('returns 200 with a valid action', async () => {
    const res = await request(app).get('/api/game/bot-action');
    expect(res.status).toBe(200);
    expect(ACTIONS).toContain(res.body.action);
  });

  it('responds with JSON content-type', async () => {
    const res = await request(app).get('/api/game/bot-action');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('echoes the configured CORS origin', async () => {
    const res = await request(app)
      .get('/api/game/bot-action')
      .set('Origin', 'http://localhost:3000');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });
});
