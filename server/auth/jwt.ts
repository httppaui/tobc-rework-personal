import jwt from 'jsonwebtoken';
import { env } from '../env.js';

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: string } | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (typeof payload === 'object' && payload && 'sub' in payload && typeof payload.sub === 'string') {
      return { sub: payload.sub };
    }
    return null;
  } catch {
    return null;
  }
}
