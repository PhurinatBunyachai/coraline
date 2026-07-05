import type { Response } from 'express';
import type { ScoreResponse } from '../types/api.types';

const connectionsBySession = new Map<string, Set<Response>>();

export function addConnection(sessionId: string, res: Response): void {
  const connections = connectionsBySession.get(sessionId) ?? new Set<Response>();
  connections.add(res);
  connectionsBySession.set(sessionId, connections);
}

export function removeConnection(sessionId: string, res: Response): void {
  const connections = connectionsBySession.get(sessionId);
  if (!connections) return;

  connections.delete(res);
  if (connections.size === 0) connectionsBySession.delete(sessionId);
}

export function broadcastScore(sessionId: string, score: ScoreResponse): void {
  const connections = connectionsBySession.get(sessionId);
  if (!connections) return;

  const payload = `data: ${JSON.stringify(score)}\n\n`;
  for (const res of connections) res.write(payload);
}
