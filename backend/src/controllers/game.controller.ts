import type { Request, Response } from 'express';
import { pickRandomAction } from '../services/botAction.service';
import type { BotActionResponse } from '../types/api.types';

export function getBotAction(req: Request, res: Response<BotActionResponse>): void {
  const action = pickRandomAction();
  res.status(200).json({ action });
}
