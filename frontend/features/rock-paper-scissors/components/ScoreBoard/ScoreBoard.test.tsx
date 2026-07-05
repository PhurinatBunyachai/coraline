import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  it('renders both scores under their labels', () => {
    render(<ScoreBoard yourScore={5} highScore={12} />);

    expect(screen.getByText('Your Score:')).toBeInTheDocument();
    expect(screen.getByText('High Score:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
