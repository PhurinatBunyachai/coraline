import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BotDisplay } from './BotDisplay';

describe('BotDisplay', () => {
  it('shows a placeholder when there is no bot action', () => {
    render(<BotDisplay botAction={null} />);
    expect(screen.getByText('???')).toBeInTheDocument();
  });

  it('shows the action label when a bot action is set', () => {
    render(<BotDisplay botAction="SCISSORS" />);
    expect(screen.getByText('SCISSORS')).toBeInTheDocument();
  });
});
