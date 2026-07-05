import { describe, it, expect } from 'vitest';
import { resolveOutcome } from './rules';
import type { Action } from '../types/action.types';
import type { GameOutcome } from '../types/game.types';

describe('resolveOutcome', () => {
  const cases: Array<[Action, Action, GameOutcome]> = [
    ['ROCK', 'ROCK', 'DRAW'],
    ['PAPER', 'PAPER', 'DRAW'],
    ['SCISSORS', 'SCISSORS', 'DRAW'],
    ['ROCK', 'SCISSORS', 'WIN'],
    ['PAPER', 'ROCK', 'WIN'],
    ['SCISSORS', 'PAPER', 'WIN'],
    ['ROCK', 'PAPER', 'LOSE'],
    ['PAPER', 'SCISSORS', 'LOSE'],
    ['SCISSORS', 'ROCK', 'LOSE'],
  ];

  it.each(cases)('player %s vs bot %s -> %s', (player, bot, expected) => {
    expect(resolveOutcome(player, bot)).toBe(expected);
  });
});
