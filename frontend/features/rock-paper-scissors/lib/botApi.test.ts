import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchBotAction } from './botApi';

function mockFetch(response: { ok: boolean; status?: number; json: () => Promise<unknown> }) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response as unknown as Response));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchBotAction', () => {
  it('returns the action on success', async () => {
    mockFetch({ ok: true, json: async () => ({ action: 'ROCK' }) });
    await expect(fetchBotAction()).resolves.toBe('ROCK');
  });

  it('requests the relative bot-action endpoint', async () => {
    mockFetch({ ok: true, json: async () => ({ action: 'ROCK' }) });
    await fetchBotAction();
    expect(fetch).toHaveBeenCalledWith('/api/game/bot-action');
  });

  it('throws when the response is not ok', async () => {
    mockFetch({ ok: false, status: 500, json: async () => ({}) });
    await expect(fetchBotAction()).rejects.toThrow('Bot action request failed: 500');
  });

  it('throws when the action is not a recognized value', async () => {
    mockFetch({ ok: true, json: async () => ({ action: 'INVALID' }) });
    await expect(fetchBotAction()).rejects.toThrow('Malformed bot action response');
  });

  it('throws when the action is missing entirely', async () => {
    mockFetch({ ok: true, json: async () => ({}) });
    await expect(fetchBotAction()).rejects.toThrow('Malformed bot action response');
  });
});
