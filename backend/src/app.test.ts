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

describe('GET /api/game/score', () => {
  it('starts a new session at 0/0 and sets a session cookie', async () => {
    const res = await request(app).get('/api/game/score');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ yourScore: 0, highScore: 0 });
    expect(res.headers['set-cookie']?.[0]).toMatch(/^rps_session_id=/);
  });
});

describe('POST /api/game/score/outcome', () => {
  it('persists score across requests for the same session', async () => {
    const agent = request.agent(app);

    const first = await agent.post('/api/game/score/outcome').send({ outcome: 'WIN' });
    expect(first.status).toBe(200);
    expect(first.body).toEqual({ yourScore: 1, highScore: 1 });

    const second = await agent.post('/api/game/score/outcome').send({ outcome: 'WIN' });
    expect(second.body).toEqual({ yourScore: 2, highScore: 2 });
  });

  it('rejects an invalid outcome with 400', async () => {
    const res = await request(app).post('/api/game/score/outcome').send({ outcome: 'NOPE' });
    expect(res.status).toBe(400);
  });
});
