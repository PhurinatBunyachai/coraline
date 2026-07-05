import type { Request, Response } from 'express';
import { applyOutcome, getScore } from '../services/score.service';
import { resolveSessionId } from '../services/session.service';
import { addConnection, broadcastScore, removeConnection } from '../services/sse.service';
import type { OutcomeRequestBody, ScoreResponse } from '../types/api.types';
import type { GameOutcome } from '../types/game.types';

const VALID_OUTCOMES: readonly GameOutcome[] = ['WIN', 'LOSE', 'DRAW'];
const HEARTBEAT_INTERVAL_MS = 25000;

export function getScoreHandler(req: Request, res: Response<ScoreResponse>): void {
  const sessionId = resolveSessionId(req, res);
  res.status(200).json(getScore(sessionId));
}

export function postOutcomeHandler(
  req: Request<Record<string, never>, ScoreResponse, OutcomeRequestBody>,
  res: Response<ScoreResponse | { error: string }>,
): void {
  const sessionId = resolveSessionId(req, res);
  const { outcome } = req.body;

  if (!VALID_OUTCOMES.includes(outcome)) {
    res.status(400).json({ error: 'Invalid outcome' });
    return;
  }

  const updated = applyOutcome(sessionId, outcome);
  broadcastScore(sessionId, updated);
  res.status(200).json(updated);
}

export function streamScoreHandler(req: Request, res: Response): void {
  const sessionId = resolveSessionId(req, res);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  res.write(`data: ${JSON.stringify(getScore(sessionId))}\n\n`);
  addConnection(sessionId, res);

  const heartbeat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_INTERVAL_MS);

  req.on('close', () => {
    clearInterval(heartbeat);
    removeConnection(sessionId, res);
  });
}
