import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRockPaperScissorsGame } from './RockPaperScissorsGame.hook';
import { fetchBotAction } from './lib/botApi';
import { fetchScore, postOutcome } from './lib/scoreApi';
import type { Action } from './types/action.types';

vi.mock('./lib/botApi');
vi.mock('./lib/scoreApi');

const mockedFetchBotAction = vi.mocked(fetchBotAction);
const mockedFetchScore = vi.mocked(fetchScore);
const mockedPostOutcome = vi.mocked(postOutcome);

// Flushes the microtask queue so a pending fetchBotAction() promise resolves
// before we advance the reveal-delay timer that its `.then` callback schedules.
async function flushMicrotasks() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

async function advanceRevealDelay() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(2000);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  mockedFetchScore.mockResolvedValue({ yourScore: 0, highScore: 0 });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  // restoreAllMocks only restores vi.spyOn mocks; factory-less vi.mock()
  // module mocks keep their call history unless reset explicitly.
  mockedFetchBotAction.mockReset();
  mockedFetchScore.mockReset();
  mockedPostOutcome.mockReset();
});

describe('useRockPaperScissorsGame', () => {
  it('loads initial scores from the backend', async () => {
    mockedFetchScore.mockResolvedValue({ yourScore: 3, highScore: 10 });
    const { result } = renderHook(() => useRockPaperScissorsGame());
    await flushMicrotasks();

    expect(result.current.yourScore).toBe(3);
    expect(result.current.highScore).toBe(10);
  });

  it('ignores a second select while locked', () => {
    mockedFetchBotAction.mockReturnValue(new Promise<Action>(() => {}));
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
      result.current.handleSelectAction('ROCK');
    });

    expect(mockedFetchBotAction).toHaveBeenCalledTimes(1);
  });

  it('on WIN, reveals the bot action and applies the score returned by the backend', async () => {
    mockedFetchBotAction.mockResolvedValue('SCISSORS'); // player ROCK beats bot SCISSORS
    mockedPostOutcome.mockResolvedValue({ yourScore: 3, highScore: 3 });
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();

    expect(result.current.botAction).toBe('SCISSORS');
    expect(result.current.isLocked).toBe(true);

    await advanceRevealDelay();

    expect(mockedPostOutcome).toHaveBeenCalledWith('WIN');
    expect(result.current.yourScore).toBe(3);
    expect(result.current.highScore).toBe(3);
    expect(result.current.botAction).toBeNull();
    expect(result.current.isLocked).toBe(false);
  });

  it('on LOSE, applies the reset score returned by the backend', async () => {
    mockedFetchBotAction.mockResolvedValue('PAPER'); // player ROCK loses to bot PAPER
    mockedPostOutcome.mockResolvedValue({ yourScore: 0, highScore: 10 });
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();
    await advanceRevealDelay();

    expect(mockedPostOutcome).toHaveBeenCalledWith('LOSE');
    expect(result.current.yourScore).toBe(0);
    expect(result.current.highScore).toBe(10);
  });

  it('on DRAW, sends the outcome and applies the unchanged score returned by the backend', async () => {
    mockedFetchBotAction.mockResolvedValue('ROCK'); // player ROCK vs bot ROCK
    mockedPostOutcome.mockResolvedValue({ yourScore: 4, highScore: 10 });
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();
    await advanceRevealDelay();

    expect(mockedPostOutcome).toHaveBeenCalledWith('DRAW');
    expect(result.current.yourScore).toBe(4);
  });

  it('unlocks cleanly without throwing when fetchBotAction rejects', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedFetchBotAction.mockRejectedValue(new Error('network fail'));
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();

    expect(result.current.isLocked).toBe(false);
    expect(result.current.botAction).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockedPostOutcome).not.toHaveBeenCalled();
  });

  it('unlocks cleanly without throwing when postOutcome rejects', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedFetchBotAction.mockResolvedValue('SCISSORS');
    mockedPostOutcome.mockRejectedValue(new Error('network fail'));
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();
    await advanceRevealDelay();

    expect(result.current.isLocked).toBe(false);
    expect(result.current.botAction).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('clears the pending reveal timeout on unmount', async () => {
    mockedFetchBotAction.mockResolvedValue('SCISSORS');
    const { result, unmount } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();

    unmount();
    await advanceRevealDelay();

    expect(mockedPostOutcome).not.toHaveBeenCalled();
  });
});
