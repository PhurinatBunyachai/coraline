import { describe, it, expect, vi, afterEach } from 'vitest';
import { pickRandomAction } from './botAction.service';
import { ACTIONS } from '../models/action.model';

describe('pickRandomAction', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns ROCK when Math.random is at the low boundary', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(pickRandomAction()).toBe('ROCK');
  });

  it('returns PAPER for a mid-range value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.34);
    expect(pickRandomAction()).toBe('PAPER');
  });

  it('returns SCISSORS when Math.random is near the high boundary', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99999);
    expect(pickRandomAction()).toBe('SCISSORS');
  });

  it('always returns a member of ACTIONS across many calls', () => {
    for (let i = 0; i < 100; i++) {
      expect(ACTIONS).toContain(pickRandomAction());
    }
  });
});
