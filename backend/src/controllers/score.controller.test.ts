import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getScoreHandler, postOutcomeHandler } from './score.controller';
import { applyOutcome, getScore } from '../services/score.service';
import { resolveSessionId } from '../services/session.service';
import { broadcastScore } from '../services/sse.service';

vi.mock('../services/score.service');
vi.mock('../services/session.service');
vi.mock('../services/sse.service');

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
}

describe('getScoreHandler', () => {
  beforeEach(() => {
    vi.mocked(resolveSessionId).mockReturnValue('session-1');
    vi.mocked(getScore).mockReturnValue({ yourScore: 3, highScore: 5 });
  });

  it('responds 200 with the session score', () => {
    const res = mockResponse();
    getScoreHandler({} as Request, res);

    expect(getScore).toHaveBeenCalledWith('session-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ yourScore: 3, highScore: 5 });
  });
});

describe('postOutcomeHandler', () => {
  beforeEach(() => {
    vi.mocked(applyOutcome).mockClear();
    vi.mocked(broadcastScore).mockClear();
    vi.mocked(resolveSessionId).mockReturnValue('session-1');
    vi.mocked(applyOutcome).mockReturnValue({ yourScore: 1, highScore: 1 });
  });

  it('applies a valid outcome and responds 200 with the updated score', () => {
    const res = mockResponse();
    const req = { body: { outcome: 'WIN' } } as Request;

    postOutcomeHandler(req, res);

    expect(applyOutcome).toHaveBeenCalledWith('session-1', 'WIN');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ yourScore: 1, highScore: 1 });
  });

  it('broadcasts the updated score to the session', () => {
    const res = mockResponse();
    const req = { body: { outcome: 'WIN' } } as Request;

    postOutcomeHandler(req, res);

    expect(broadcastScore).toHaveBeenCalledWith('session-1', { yourScore: 1, highScore: 1 });
  });

  it('rejects an invalid outcome with 400', () => {
    const res = mockResponse();
    const req = { body: { outcome: 'INVALID' } } as unknown as Request;

    postOutcomeHandler(req, res);

    expect(applyOutcome).not.toHaveBeenCalled();
    expect(broadcastScore).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid outcome' });
  });
});
