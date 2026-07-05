import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges plain class strings', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy inputs', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('resolves conflicting Tailwind utilities, keeping the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
