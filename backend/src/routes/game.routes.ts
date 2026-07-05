import { Router } from 'express';
import { getBotAction } from '../controllers/game.controller';

export const gameRouter = Router();

gameRouter.get('/bot-action', getBotAction);
