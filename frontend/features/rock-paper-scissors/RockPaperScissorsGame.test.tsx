import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RockPaperScissorsGame } from './RockPaperScissorsGame';

// No button is clicked here, so fetchBotAction is never triggered and global
// fetch never needs mocking. If this file grows an interaction test, mock fetch first.
describe('RockPaperScissorsGame', () => {
  it('renders the initial game state', () => {
    render(<RockPaperScissorsGame />);

    expect(screen.getByText('Your Score:')).toBeInTheDocument();
    expect(screen.getByText('High Score:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(2);
    expect(screen.getByText('???')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ROCK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PAPER' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SCISSORS' })).toBeInTheDocument();
  });
});
