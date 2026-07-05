import type { Action } from '../types/action.types';

export const ACTIONS: readonly Action[] = ['ROCK', 'PAPER', 'SCISSORS'];

export const ACTION_LABELS: Record<Action, string> = {
  ROCK: 'ROCK',
  PAPER: 'PAPER',
  SCISSORS: 'SCISSORS',
};
