import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../auth/session.js';
import { db } from '../db.js';

const router = Router();

const listSchema = z.object({
  courseIds: z.array(z.string()),
});

function getList(userId: string, listType: 'wishlist' | 'cart'): string[] {
  const rows = db
    .prepare(
      'SELECT course_id FROM user_course_lists WHERE user_id = ? AND list_type = ? ORDER BY created_at ASC',
    )
    .all(userId, listType) as { course_id: string }[];
  return rows.map((r) => r.course_id);
}

function setList(userId: string, listType: 'wishlist' | 'cart', courseIds: string[]) {
  const unique = [...new Set(courseIds)];
  db.prepare('DELETE FROM user_course_lists WHERE user_id = ? AND list_type = ?').run(userId, listType);
  const insert = db.prepare(
    'INSERT INTO user_course_lists (user_id, list_type, course_id) VALUES (?, ?, ?)',
  );
  for (const courseId of unique) {
    insert.run(userId, listType, courseId);
  }
}

router.get('/wishlist', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  res.json({ courseIds: getList(user.id, 'wishlist') });
});

router.put('/wishlist', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const parsed = listSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid wishlist.' });
    return;
  }
  setList(user.id, 'wishlist', parsed.data.courseIds);
  res.json({ courseIds: getList(user.id, 'wishlist') });
});

router.get('/cart', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  res.json({ courseIds: getList(user.id, 'cart') });
});

router.put('/cart', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const parsed = listSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid cart.' });
    return;
  }
  setList(user.id, 'cart', parsed.data.courseIds);
  res.json({ courseIds: getList(user.id, 'cart') });
});

export default router;
