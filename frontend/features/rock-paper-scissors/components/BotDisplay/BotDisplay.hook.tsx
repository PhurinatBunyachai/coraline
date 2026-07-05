import { ACTION_LABELS } from '../../constants/actions';
import type { Action } from '../../types/action.types';

interface UseBotDisplayParams {
  botAction: Action | null;
}

export function useBotDisplay({ botAction }: UseBotDisplayParams) {
  return {
    displayText: botAction === null ? '???' : ACTION_LABELS[botAction],
  };
}
