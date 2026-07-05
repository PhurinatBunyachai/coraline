interface UseScoreBoardParams {
  yourScore: number;
  highScore: number;
}

export function useScoreBoard({ yourScore, highScore }: UseScoreBoardParams) {
  return {
    rows: [
      { key: 'your-score', label: 'Your Score:', value: yourScore, unit: 'turn' },
      { key: 'high-score', label: 'High Score:', value: highScore, unit: 'turn' },
    ],
  };
}
