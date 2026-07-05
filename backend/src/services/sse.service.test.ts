import { describe, it, expect, vi } from 'vitest';
import type { Response } from 'express';
import { addConnection, broadcastScore, removeConnection } from './sse.service';

function fakeResponse(): Response {
  return { write: vi.fn() } as unknown as Response;
}

describe('sse.service', () => {
  const sessionId = `test-${Math.floor(Math.random() * 1e9)}`;

  it('broadcasts to all connections registered for a session', () => {
    const id = `broadcast-${sessionId}`;
    const resA = fakeResponse();
    const resB = fakeResponse();
    addConnection(id, resA);
    addConnection(id, resB);

    broadcastScore(id, { yourScore: 2, highScore: 3 });

    const payload = `data: ${JSON.stringify({ yourScore: 2, highScore: 3 })}\n\n`;
    expect(resA.write).toHaveBeenCalledWith(payload);
    expect(resB.write).toHaveBeenCalledWith(payload);
  });

  it('does not notify a connection after it is removed', () => {
    const id = `remove-${sessionId}`;
    const res = fakeResponse();
    addConnection(id, res);
    removeConnection(id, res);

    broadcastScore(id, { yourScore: 1, highScore: 1 });

    expect(res.write).not.toHaveBeenCalled();
  });

  it('is a no-op when broadcasting to a session with no connections', () => {
    expect(() => broadcastScore(`unseen-${sessionId}`, { yourScore: 0, highScore: 0 })).not.toThrow();
  });
});
