import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { clearSessionCookie, publicUser, readSessionUser, setSessionCookie } from '../auth/session.js';
import { db, type UserRow } from '../db.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[a-zA-Z]/, 'Password must contain a letter.')
    .regex(/\d/, 'Password must contain a number.'),
});

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Invalid input.';
    res.status(400).json({ error: message });
    return;
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists. Try logging in.' });
    return;
  }

  const id = randomUUID();
  const passwordHash = await hashPassword(password);

  db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(
    id,
    name,
    normalizedEmail,
    passwordHash,
  );

  setSessionCookie(res, id);
  res.status(201).json({ user: publicUser({ id, name, email: normalizedEmail }) });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Please enter your email and password.';
    res.status(400).json({ error: message });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const row = db
    .prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?')
    .get(email) as UserRow | undefined;

  if (!row) {
    res.status(401).json({ error: 'No account found with that email. Create an account first.' });
    return;
  }

  const valid = await verifyPassword(parsed.data.password, row.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Incorrect password. Please try again.' });
    return;
  }

  setSessionCookie(res, row.id);
  res.json({ user: publicUser(row) });
});

router.post('/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const row = readSessionUser(req);
  if (!row) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ user: publicUser(row) });
});

export default router;
