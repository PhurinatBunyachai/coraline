import type { Action } from '../types/action.types';
import type { GameOutcome } from '../types/game.types';

const BEATS: Record<Action, Action> = {
  ROCK: 'SCISSORS',
  PAPER: 'ROCK',
  SCISSORS: 'PAPER',
};

export function resolveOutcome(playerAction: Action, botAction: Action): GameOutcome {
  if (playerAction === botAction) return 'DRAW';
  return BEATS[playerAction] === botAction ? 'WIN' : 'LOSE';
}
