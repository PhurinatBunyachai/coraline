import { useScoreBoard } from './ScoreBoard.hook';

interface ScoreBoardProps {
  yourScore: number;
  highScore: number;
}

export function ScoreBoard({ yourScore, highScore }: ScoreBoardProps) {
  const { rows } = useScoreBoard({ yourScore, highScore });

  return (
    <div className="flex flex-col items-end gap-2 self-end">
      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-[auto_2.5rem_auto] gap-3 text-sm">
          <span>{row.label}</span>
          <span className="text-right">{row.value}</span>
          <span>{row.unit}</span>
        </div>
      ))}
    </div>
  );
}
