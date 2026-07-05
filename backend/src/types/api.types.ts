import type { Action } from '../models/action.model';
import type { GameOutcome } from './game.types';

export interface BotActionResponse {
  action: Action;
}

export interface ScoreResponse {
  yourScore: number;
  highScore: number;
}

export interface OutcomeRequestBody {
  outcome: GameOutcome;
}
