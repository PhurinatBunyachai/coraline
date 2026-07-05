import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';

export const SESSION_COOKIE_NAME = 'rps_session_id';
const SESSION_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

export function resolveSessionId(req: Request, res: Response): string {
  const existing = req.cookies?.[SESSION_COOKIE_NAME];
  if (typeof existing === 'string' && existing.length > 0) return existing;

  const sessionId = randomUUID();
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE_MS,
  });
  return sessionId;
}
