import type { Action } from './action.types';

export type GameOutcome = 'WIN' | 'LOSE' | 'DRAW';

export interface BotActionResponse {
  action: Action;
}

export interface GameState {
  yourScore: number;
  highScore: number;
  botAction: Action | null;
  isLocked: boolean;
}
