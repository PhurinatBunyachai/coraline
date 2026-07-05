import { useEffect, useRef, useState } from 'react';
import { resolveOutcome } from './constants/rules';
import { fetchBotAction } from './lib/botApi';
import { fetchScore, postOutcome } from './lib/scoreApi';
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
    fetchScore()
      .then(({ yourScore: fetchedScore, highScore: fetchedHighScore }) => {
        setYourScore(fetchedScore);
        setHighScore(fetchedHighScore);
      })
      .catch((error) => {
        console.error('Failed to fetch score', error);
      });
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

          postOutcome(outcome)
            .then(({ yourScore: nextScore, highScore: nextHighScore }) => {
              setYourScore(nextScore);
              setHighScore(nextHighScore);
            })
            .catch((error) => {
              console.error('Failed to update score', error);
            })
            .finally(() => {
              setBotAction(null);
              isLockedRef.current = false;
              setIsLocked(false);
            });
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
