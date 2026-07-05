import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { gameRouter } from './routes/game.routes';

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/game', gameRouter);
