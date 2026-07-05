import { Router } from 'express';
import { getBotAction } from '../controllers/game.controller';
import { getScoreHandler, postOutcomeHandler } from '../controllers/score.controller';

export const gameRouter = Router();

gameRouter.get('/bot-action', getBotAction);
gameRouter.get('/score', getScoreHandler);
gameRouter.post('/score/outcome', postOutcomeHandler);
