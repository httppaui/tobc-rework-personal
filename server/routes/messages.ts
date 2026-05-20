import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../auth/session.js';
import { db } from '../db.js';

const router = Router();

const DEMO_REPLIES = [
  'Thanks for your message! A support specialist will follow up shortly.',
  'I have noted your request. Include your booking reference if you have one.',
  'We typically reply within a few minutes during business hours (Mon–Sat, 8am–8pm PHT).',
];

type ThreadRow = {
  id: string;
  title: string;
  subtitle: string;
  created_at: string;
};

type MessageRow = {
  id: string;
  thread_id: string;
  sender: 'user' | 'agent' | 'system';
  body: string;
  created_at: string;
};

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function ensureDefaultThreads(userId: string) {
  const count = db
    .prepare('SELECT COUNT(*) as c FROM chat_threads WHERE user_id = ?')
    .get(userId) as { c: number };

  if (count.c > 0) return;

  const supportId = randomUUID();
  const bookingId = randomUUID();

  db.prepare('INSERT INTO chat_threads (id, user_id, title, subtitle) VALUES (?, ?, ?, ?)').run(
    supportId,
    userId,
    'TOBC Support',
    'General help & bookings',
  );
  db.prepare('INSERT INTO chat_threads (id, user_id, title, subtitle) VALUES (?, ?, ?, ?)').run(
    bookingId,
    userId,
    'Booking assistant',
    'Schedules & confirmations',
  );

  const welcome = randomUUID();
  db.prepare(
    'INSERT INTO chat_messages (id, thread_id, sender, body) VALUES (?, ?, ?, ?)',
  ).run(
    welcome,
    supportId,
    'agent',
    'Hi! I am Mara from TOBC Support. Ask about courses, bookings, payments, or MARINA accreditation.',
  );
}

router.get('/threads', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  ensureDefaultThreads(user.id);

  const threads = db
    .prepare('SELECT id, title, subtitle, created_at FROM chat_threads WHERE user_id = ? ORDER BY created_at ASC')
    .all(user.id) as ThreadRow[];

  const lastMsgStmt = db.prepare(
    `SELECT body, created_at FROM chat_messages WHERE thread_id = ? ORDER BY created_at DESC LIMIT 1`,
  );
  const payload = threads.map((t) => {
    const last = lastMsgStmt.get(t.id) as { body: string; created_at: string } | undefined;
    return {
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      preview: last?.body ?? '',
      time: last ? formatTime(last.created_at) : '',
      unread: 0,
      online: true,
    };
  });

  res.json({ threads: payload });
});

router.get('/threads/:threadId/messages', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const thread = db
    .prepare('SELECT id FROM chat_threads WHERE id = ? AND user_id = ?')
    .get(req.params.threadId, user.id);
  if (!thread) {
    res.status(404).json({ error: 'Conversation not found.' });
    return;
  }

  const rows = db
    .prepare(
      'SELECT id, thread_id, sender, body, created_at FROM chat_messages WHERE thread_id = ? ORDER BY created_at ASC',
    )
    .all(req.params.threadId) as MessageRow[];

  res.json({
    messages: rows.map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.body,
      time: formatTime(m.created_at),
    })),
  });
});

const postMessageSchema = z.object({
  text: z.string().trim().min(1).max(4000),
});

router.post('/threads/:threadId/messages', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const parsed = postMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  const thread = db
    .prepare('SELECT id FROM chat_threads WHERE id = ? AND user_id = ?')
    .get(req.params.threadId, user.id);
  if (!thread) {
    res.status(404).json({ error: 'Conversation not found.' });
    return;
  }

  const userMsgId = randomUUID();
  db.prepare('INSERT INTO chat_messages (id, thread_id, sender, body) VALUES (?, ?, ?, ?)').run(
    userMsgId,
    req.params.threadId,
    'user',
    parsed.data.text,
  );

  const replyId = randomUUID();
  const replyBody = DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
  db.prepare('INSERT INTO chat_messages (id, thread_id, sender, body) VALUES (?, ?, ?, ?)').run(
    replyId,
    req.params.threadId,
    'agent',
    replyBody,
  );

  const userRow = db
    .prepare('SELECT id, sender, body, created_at FROM chat_messages WHERE id = ?')
    .get(userMsgId) as MessageRow;
  const agentRow = db
    .prepare('SELECT id, sender, body, created_at FROM chat_messages WHERE id = ?')
    .get(replyId) as MessageRow;

  res.status(201).json({
    messages: [userRow, agentRow].map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.body,
      time: formatTime(m.created_at),
    })),
  });
});

export default router;
