import { Router } from 'express';
import { getBotAction } from '../controllers/game.controller';
import { getScoreHandler, postOutcomeHandler, streamScoreHandler } from '../controllers/score.controller';

export const gameRouter = Router();

gameRouter.get('/bot-action', getBotAction);
gameRouter.get('/score', getScoreHandler);
gameRouter.get('/score/stream', streamScoreHandler);
gameRouter.post('/score/outcome', postOutcomeHandler);
