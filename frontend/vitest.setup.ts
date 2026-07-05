import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

if (typeof globalThis.EventSource === 'undefined') {
  class MockEventSource {
    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    close() {}
  }
  // @ts-expect-error - minimal stub, jsdom/node have no EventSource
  globalThis.EventSource = MockEventSource;
}

afterEach(() => {
  cleanup();
});
