import { describe, it, expect, afterEach, vi } from 'vitest';
import { readCookie, writeCookie, readNumericCookie } from './cookies';

function clearAllCookies() {
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0];
    if (name) document.cookie = `${name}=; max-age=0; path=/`;
  });
}

afterEach(() => {
  clearAllCookies();
  vi.restoreAllMocks();
});

describe('readCookie', () => {
  it('returns null when the cookie is absent', () => {
    expect(readCookie('missing')).toBeNull();
  });

  it('returns the value when present', () => {
    document.cookie = 'foo=bar';
    expect(readCookie('foo')).toBe('bar');
  });

  it('handles values containing "="', () => {
    document.cookie = 'foo=a=b=c';
    expect(readCookie('foo')).toBe('a=b=c');
  });

  it('URL-decodes the value', () => {
    document.cookie = `foo=${encodeURIComponent('hello world')}`;
    expect(readCookie('foo')).toBe('hello world');
  });
});

describe('writeCookie', () => {
  it('sets a readable cookie', () => {
    writeCookie('foo', 'bar');
    expect(readCookie('foo')).toBe('bar');
  });

  it('URL-encodes the value', () => {
    writeCookie('foo', 'hello world');
    expect(document.cookie).toContain('foo=hello%20world');
  });

  it('uses a 30-day default max-age', () => {
    const setSpy = vi.spyOn(document, 'cookie', 'set');
    writeCookie('foo', 'bar');
    expect(setSpy).toHaveBeenCalledWith(expect.stringContaining(`max-age=${60 * 60 * 24 * 30}`));
  });

  it.todo('returns early when document is undefined (SSR) - requires a node environment, not covered here');
});

describe('readNumericCookie', () => {
  it('returns the fallback when absent', () => {
    expect(readNumericCookie('missing', 42)).toBe(42);
  });

  it('parses a valid integer', () => {
    document.cookie = 'score=7';
    expect(readNumericCookie('score', 0)).toBe(7);
  });

  it('returns the fallback for a negative value', () => {
    document.cookie = 'score=-3';
    expect(readNumericCookie('score', 0)).toBe(0);
  });

  it('returns the fallback for a non-numeric value', () => {
    document.cookie = 'score=abc';
    expect(readNumericCookie('score', 5)).toBe(5);
  });
});
