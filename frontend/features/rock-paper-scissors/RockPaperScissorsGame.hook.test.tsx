import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRockPaperScissorsGame } from './RockPaperScissorsGame.hook';
import { readNumericCookie, writeCookie } from '../../lib/cookies';
import { fetchBotAction } from './lib/botApi';
import { COOKIE_KEYS } from './constants/cookieKeys';
import type { Action } from './types/action.types';

vi.mock('../../lib/cookies');
vi.mock('./lib/botApi');

const mockedReadNumericCookie = vi.mocked(readNumericCookie);
const mockedWriteCookie = vi.mocked(writeCookie);
const mockedFetchBotAction = vi.mocked(fetchBotAction);

function setInitialScores(yourScore: number, highScore: number) {
  mockedReadNumericCookie.mockImplementation((key) =>
    key === COOKIE_KEYS.YOUR_SCORE ? yourScore : highScore
  );
}

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
  setInitialScores(0, 0);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  // restoreAllMocks only restores vi.spyOn mocks; factory-less vi.mock()
  // module mocks keep their call history unless reset explicitly.
  mockedReadNumericCookie.mockReset();
  mockedWriteCookie.mockReset();
  mockedFetchBotAction.mockReset();
});

describe('useRockPaperScissorsGame', () => {
  it('loads initial scores from cookies', () => {
    setInitialScores(3, 10);
    const { result } = renderHook(() => useRockPaperScissorsGame());

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

  it('on WIN, reveals the bot action, increments score, persists it, and bumps high score when exceeded', async () => {
    setInitialScores(2, 2);
    mockedFetchBotAction.mockResolvedValue('SCISSORS'); // player ROCK beats bot SCISSORS
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();

    expect(result.current.botAction).toBe('SCISSORS');
    expect(result.current.isLocked).toBe(true);

    await advanceRevealDelay();

    expect(result.current.yourScore).toBe(3);
    expect(result.current.highScore).toBe(3);
    expect(result.current.botAction).toBeNull();
    expect(result.current.isLocked).toBe(false);
    expect(mockedWriteCookie).toHaveBeenCalledWith(COOKIE_KEYS.YOUR_SCORE, '3');
    expect(mockedWriteCookie).toHaveBeenCalledWith(COOKIE_KEYS.HIGH_SCORE, '3');
  });

  it('on WIN, does not bump high score when not exceeded', async () => {
    setInitialScores(5, 10);
    mockedFetchBotAction.mockResolvedValue('SCISSORS');
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();
    await advanceRevealDelay();

    expect(result.current.yourScore).toBe(6);
    expect(result.current.highScore).toBe(10);
    expect(mockedWriteCookie).not.toHaveBeenCalledWith(COOKIE_KEYS.HIGH_SCORE, expect.anything());
  });

  it('on LOSE, resets score to 0 and persists it', async () => {
    setInitialScores(4, 10);
    mockedFetchBotAction.mockResolvedValue('PAPER'); // player ROCK loses to bot PAPER
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();
    await advanceRevealDelay();

    expect(result.current.yourScore).toBe(0);
    expect(mockedWriteCookie).toHaveBeenCalledWith(COOKIE_KEYS.YOUR_SCORE, '0');
    expect(mockedWriteCookie).not.toHaveBeenCalledWith(COOKIE_KEYS.HIGH_SCORE, expect.anything());
  });

  it('on DRAW, leaves the score untouched and writes nothing', async () => {
    setInitialScores(4, 10);
    mockedFetchBotAction.mockResolvedValue('ROCK'); // player ROCK vs bot ROCK
    const { result } = renderHook(() => useRockPaperScissorsGame());

    act(() => {
      result.current.handleSelectAction('ROCK');
    });
    await flushMicrotasks();
    await advanceRevealDelay();

    expect(result.current.yourScore).toBe(4);
    expect(mockedWriteCookie).not.toHaveBeenCalled();
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
    expect(mockedWriteCookie).not.toHaveBeenCalled();
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

    expect(mockedWriteCookie).not.toHaveBeenCalled();
  });
});
