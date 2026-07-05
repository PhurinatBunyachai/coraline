import express from 'express';
import cors from 'cors';
import { gameRouter } from './routes/game.routes';

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/game', gameRouter);
