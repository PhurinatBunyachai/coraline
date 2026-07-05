import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBotDisplay } from './BotDisplay.hook';
import { ACTION_LABELS } from '../../constants/actions';
import type { Action } from '../../types/action.types';

describe('useBotDisplay', () => {
  it('shows a placeholder when there is no bot action', () => {
    const { result } = renderHook(() => useBotDisplay({ botAction: null }));
    expect(result.current.displayText).toBe('???');
  });

  it.each(['ROCK', 'PAPER', 'SCISSORS'] satisfies Action[])('shows the label for %s', (action) => {
    const { result } = renderHook(() => useBotDisplay({ botAction: action }));
    expect(result.current.displayText).toBe(ACTION_LABELS[action]);
  });
});
