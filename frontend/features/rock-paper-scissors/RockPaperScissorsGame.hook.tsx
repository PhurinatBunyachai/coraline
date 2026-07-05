import { useEffect, useRef, useState } from 'react';
import { readNumericCookie, writeCookie } from '@/lib/cookies';
import { COOKIE_KEYS, DEFAULT_SCORE } from './constants/cookieKeys';
import { resolveOutcome } from './constants/rules';
import { fetchBotAction } from './lib/botApi';
import type { Action } from './types/action.types';

const REVEAL_DELAY_MS = 2000;

export function useRockPaperScissorsGame() {
  const [yourScore, setYourScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [botAction, setBotAction] = useState<Action | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    // One-time hydrate from cookies after mount: must stay client-only, cookies aren't available during SSR.
    /* eslint-disable react-hooks/set-state-in-effect */
    setYourScore(readNumericCookie(COOKIE_KEYS.YOUR_SCORE, DEFAULT_SCORE));
    setHighScore(readNumericCookie(COOKIE_KEYS.HIGH_SCORE, DEFAULT_SCORE));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleSelectAction(playerAction: Action) {
    if (isLockedRef.current) return;
    isLockedRef.current = true;
    setIsLocked(true);

    fetchBotAction()
      .then((revealedBotAction) => {
        setBotAction(revealedBotAction);

        timeoutRef.current = setTimeout(() => {
          const outcome = resolveOutcome(playerAction, revealedBotAction);

          setYourScore((currentScore) => {
            if (outcome === 'WIN') {
              const nextScore = currentScore + 1;
              writeCookie(COOKIE_KEYS.YOUR_SCORE, String(nextScore));

              setHighScore((currentHighScore) => {
                if (nextScore > currentHighScore) {
                  writeCookie(COOKIE_KEYS.HIGH_SCORE, String(nextScore));
                  return nextScore;
                }
                return currentHighScore;
              });

              return nextScore;
            }

            if (outcome === 'LOSE') {
              writeCookie(COOKIE_KEYS.YOUR_SCORE, '0');
              return 0;
            }

            return currentScore;
          });

          setBotAction(null);
          isLockedRef.current = false;
          setIsLocked(false);
        }, REVEAL_DELAY_MS);
      })
      .catch((error) => {
        console.error('Failed to fetch bot action', error);
        isLockedRef.current = false;
        setIsLocked(false);
      });
  }

  return {
    yourScore,
    highScore,
    botAction,
    isLocked,
    handleSelectAction,
  };
}
