import { ACTIONS, ACTION_LABELS } from '../../constants/actions';
import type { Action } from '../../types/action.types';

interface UseActionButtonsParams {
  onSelect: (action: Action) => void;
  disabled: boolean;
}

export function useActionButtons({ onSelect, disabled }: UseActionButtonsParams) {
  const actions = ACTIONS.map((action) => ({
    value: action,
    label: ACTION_LABELS[action],
    disabled,
    onClick: () => onSelect(action),
  }));

  return { actions };
}
