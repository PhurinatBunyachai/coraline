import type { GameOutcome } from '../types/game.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export interface ScoreResponse {
  yourScore: number;
  highScore: number;
}

export async function fetchScore(): Promise<ScoreResponse> {
  const response = await fetch(`${API_BASE_URL}/api/game/score`, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Score request failed: ${response.status}`);
  }

  return response.json();
}

export async function postOutcome(outcome: GameOutcome): Promise<ScoreResponse> {
  const response = await fetch(`${API_BASE_URL}/api/game/score/outcome`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outcome }),
  });
  if (!response.ok) {
    throw new Error(`Outcome request failed: ${response.status}`);
  }

  return response.json();
}
