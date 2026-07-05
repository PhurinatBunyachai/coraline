import { describe, it, expect, beforeEach } from 'vitest';
import { applyOutcome, getScore } from './score.service';

describe('score.service', () => {
  const sessionId = `test-${Math.floor(Math.random() * 1e9)}`;

  it('returns a fresh 0/0 score for a session never seen before', () => {
    expect(getScore(`unseen-${sessionId}`)).toEqual({ yourScore: 0, highScore: 0 });
  });

  it('WIN increments yourScore and bumps highScore when exceeded', () => {
    const id = `win-${sessionId}`;
    expect(applyOutcome(id, 'WIN')).toEqual({ yourScore: 1, highScore: 1 });
    expect(applyOutcome(id, 'WIN')).toEqual({ yourScore: 2, highScore: 2 });
  });

  it('WIN does not lower highScore below its prior value', () => {
    const id = `high-${sessionId}`;
    applyOutcome(id, 'WIN');
    applyOutcome(id, 'LOSE');
    expect(applyOutcome(id, 'WIN')).toEqual({ yourScore: 1, highScore: 1 });
  });

  it('LOSE resets yourScore to 0 and keeps highScore', () => {
    const id = `lose-${sessionId}`;
    applyOutcome(id, 'WIN');
    applyOutcome(id, 'WIN');
    expect(applyOutcome(id, 'LOSE')).toEqual({ yourScore: 0, highScore: 2 });
  });

  it('DRAW leaves the score untouched', () => {
    const id = `draw-${sessionId}`;
    applyOutcome(id, 'WIN');
    expect(applyOutcome(id, 'DRAW')).toEqual({ yourScore: 1, highScore: 1 });
  });

  it('tracks separate scores per session', () => {
    const a = `sep-a-${sessionId}`;
    const b = `sep-b-${sessionId}`;
    applyOutcome(a, 'WIN');
    expect(getScore(b)).toEqual({ yourScore: 0, highScore: 0 });
  });
});
