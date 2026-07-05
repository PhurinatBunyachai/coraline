import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useActionButtons } from './ActionButtons.hook';
import { ACTION_LABELS } from '../../constants/actions';

describe('useActionButtons', () => {
  it('returns all three actions in order with correct labels', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useActionButtons({ onSelect, disabled: false }));

    expect(result.current.actions.map((a) => a.value)).toEqual(['ROCK', 'PAPER', 'SCISSORS']);
    result.current.actions.forEach((action) => {
      expect(action.label).toBe(ACTION_LABELS[action.value]);
    });
  });

  it('passes disabled through to every action', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useActionButtons({ onSelect, disabled: true }));

    result.current.actions.forEach((action) => {
      expect(action.disabled).toBe(true);
    });
  });

  it('calls onSelect with the right action for each button', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useActionButtons({ onSelect, disabled: false }));

    result.current.actions.forEach((action) => {
      action.onClick();
      expect(onSelect).toHaveBeenCalledWith(action.value);
    });
  });
});
