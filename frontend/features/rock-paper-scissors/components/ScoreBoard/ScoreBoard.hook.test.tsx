import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScoreBoard } from './ScoreBoard.hook';

describe('useScoreBoard', () => {
  it('maps scores into labeled rows', () => {
    const { result } = renderHook(() => useScoreBoard({ yourScore: 3, highScore: 7 }));

    expect(result.current.rows).toEqual([
      { key: 'your-score', label: 'Your Score:', value: 3, unit: 'turn' },
      { key: 'high-score', label: 'High Score:', value: 7, unit: 'turn' },
    ]);
  });
});
