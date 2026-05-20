import { Router } from 'express';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { publicUser, requireAuth } from '../auth/session.js';
import { db, type UserRow } from '../db.js';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password.'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[a-zA-Z]/, 'Password must contain a letter.')
    .regex(/\d/, 'Password must contain a number.'),
});

router.get('/', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  res.json({ user: publicUser(user) });
});

router.patch('/', async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid profile.' });
    return;
  }

  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(parsed.data.name, user.id);
  res.json({ user: publicUser({ ...user, name: parsed.data.name }) });
});

router.post('/password', async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid password.' });
    return;
  }

  const row = db
    .prepare('SELECT password_hash FROM users WHERE id = ?')
    .get(user.id) as Pick<UserRow, 'password_hash'> | undefined;

  if (!row) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  const valid = await verifyPassword(parsed.data.currentPassword, row.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Current password is incorrect.' });
    return;
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, user.id);
  res.json({ ok: true });
});

export default router;
