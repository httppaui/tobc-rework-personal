import type { CookieOptions, Request, Response } from 'express';
import { verifyToken, signToken } from './jwt.js';
import { db, type UserRow } from '../db.js';
import { env } from '../env.js';

export type SessionUser = Pick<UserRow, 'id' | 'name' | 'email'>;

export function publicUser(row: SessionUser) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    provider: 'email' as const,
  };
}

function cookieOptions(): CookieOptions {
  const crossSite = env.cookieSameSite === 'none';
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production' || crossSite,
    sameSite: env.cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

export function setSessionCookie(res: Response, userId: string) {
  res.cookie(env.cookieName, signToken(userId), cookieOptions());
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(env.cookieName, cookieOptions());
}

export function readSessionUser(req: Request): SessionUser | null {
  const token = req.cookies?.[env.cookieName];
  if (!token || typeof token !== 'string') return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const row = db
    .prepare('SELECT id, name, email FROM users WHERE id = ?')
    .get(payload.sub) as SessionUser | undefined;

  return row ?? null;
}

export function requireAuth(req: Request, res: Response): SessionUser | null {
  const user = readSessionUser(req);
  if (!user) {
    res.status(401).json({ error: 'Please log in to continue.' });
    return null;
  }
  return user;
}
