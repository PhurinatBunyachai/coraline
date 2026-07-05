import { ACTIONS } from '../constants/actions';
import type { Action } from '../types/action.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function fetchBotAction(): Promise<Action> {
  const response = await fetch(`${API_BASE_URL}/api/game/bot-action`);
  if (!response.ok) {
    throw new Error(`Bot action request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!ACTIONS.includes(data.action)) {
    throw new Error('Malformed bot action response');
  }

  return data.action as Action;
}
