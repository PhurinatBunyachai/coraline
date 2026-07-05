import type { Request, Response } from 'express';
import { applyOutcome, getScore } from '../services/score.service';
import { resolveSessionId } from '../services/session.service';
import type { OutcomeRequestBody, ScoreResponse } from '../types/api.types';
import type { GameOutcome } from '../types/game.types';

const VALID_OUTCOMES: readonly GameOutcome[] = ['WIN', 'LOSE', 'DRAW'];

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

  res.status(200).json(applyOutcome(sessionId, outcome));
}
