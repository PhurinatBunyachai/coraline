import { ACTIONS } from '../models/action.model';
import type { Action } from '../models/action.model';

export function pickRandomAction(): Action {
  const index = Math.floor(Math.random() * ACTIONS.length);
  return ACTIONS[index];
}
