import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Response } from 'express';
import { getBotAction } from './game.controller';
import { pickRandomAction } from '../services/botAction.service';
import type { BotActionResponse } from '../types/api.types';

vi.mock('../services/botAction.service');

describe('getBotAction', () => {
  beforeEach(() => {
    vi.mocked(pickRandomAction).mockReturnValue('PAPER');
  });

  it('responds 200 with the picked action', () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response<BotActionResponse>;

    getBotAction({} as Parameters<typeof getBotAction>[0], res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ action: 'PAPER' });
  });
});
