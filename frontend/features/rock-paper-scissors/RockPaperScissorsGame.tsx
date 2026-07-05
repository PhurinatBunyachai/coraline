'use client';

import { Card } from '@/components/Card/Card';
import { ScoreBoard } from './components/ScoreBoard/ScoreBoard';
import { BotDisplay } from './components/BotDisplay/BotDisplay';
import { ActionButtons } from './components/ActionButtons/ActionButtons';
import { useRockPaperScissorsGame } from './RockPaperScissorsGame.hook';

export function RockPaperScissorsGame() {
  const { yourScore, highScore, botAction, isLocked, handleSelectAction } =
    useRockPaperScissorsGame();

  return (
    <Card className="mx-auto w-full max-w-2xl gap-6 rounded-2xl bg-card/80 p-4 backdrop-blur-xl sm:gap-10 sm:p-10">
      <ScoreBoard yourScore={yourScore} highScore={highScore} />
      <BotDisplay botAction={botAction} />
      <ActionButtons onSelect={handleSelectAction} disabled={isLocked} />
    </Card>
  );
}
