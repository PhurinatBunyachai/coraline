import type { ScoreResponse } from '../types/api.types';
import type { GameOutcome } from '../types/game.types';

const scoresBySession = new Map<string, ScoreResponse>();

function getOrInitScore(sessionId: string): ScoreResponse {
  const existing = scoresBySession.get(sessionId);
  if (existing) return existing;

  const initial: ScoreResponse = { yourScore: 0, highScore: 0 };
  scoresBySession.set(sessionId, initial);
  return initial;
}

export function getScore(sessionId: string): ScoreResponse {
  return getOrInitScore(sessionId);
}

export function applyOutcome(sessionId: string, outcome: GameOutcome): ScoreResponse {
  const current = getOrInitScore(sessionId);

  if (outcome === 'WIN') {
    const yourScore = current.yourScore + 1;
    const updated: ScoreResponse = { yourScore, highScore: Math.max(yourScore, current.highScore) };
    scoresBySession.set(sessionId, updated);
    return updated;
  }

  if (outcome === 'LOSE') {
    const updated: ScoreResponse = { yourScore: 0, highScore: current.highScore };
    scoresBySession.set(sessionId, updated);
    return updated;
  }

  return current;
}
