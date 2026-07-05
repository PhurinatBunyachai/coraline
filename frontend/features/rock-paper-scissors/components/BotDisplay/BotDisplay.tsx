import { Card, CardContent } from '@/components/Card/Card';
import { useBotDisplay } from './BotDisplay.hook';
import type { Action } from '../../types/action.types';

interface BotDisplayProps {
  botAction: Action | null;
}

export function BotDisplay({ botAction }: BotDisplayProps) {
  const { displayText } = useBotDisplay({ botAction });

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
      <span className="shrink-0 text-sm sm:w-28">Bot action:</span>
      <Card className="h-32 w-32 items-center justify-center rounded-none">
        <CardContent className="flex items-center justify-center text-sm font-medium">
          {displayText}
        </CardContent>
      </Card>
    </div>
  );
}
