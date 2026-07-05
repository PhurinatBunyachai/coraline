import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButtons } from './ActionButtons';

describe('ActionButtons', () => {
  it('renders a labeled button for each action', () => {
    render(<ActionButtons onSelect={vi.fn()} disabled={false} />);

    expect(screen.getByRole('button', { name: 'ROCK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PAPER' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SCISSORS' })).toBeInTheDocument();
  });

  it('calls onSelect with the clicked action', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ActionButtons onSelect={onSelect} disabled={false} />);

    await user.click(screen.getByRole('button', { name: 'PAPER' }));

    expect(onSelect).toHaveBeenCalledWith('PAPER');
  });

  it('disables every button and blocks clicks when disabled', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ActionButtons onSelect={onSelect} disabled={true} />);

    const rockButton = screen.getByRole('button', { name: 'ROCK' });
    expect(rockButton).toBeDisabled();

    await user.click(rockButton);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
