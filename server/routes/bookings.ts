import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../auth/session.js';
import { db } from '../db.js';

const router = Router();

const createBookingSchema = z.object({
  courseId: z.string().min(1),
  courseTitle: z.string().min(1),
  provider: z.string().optional(),
  location: z.string().optional(),
  price: z.string().optional(),
  category: z.string().optional(),
  scheduleDate: z.string().min(1),
  scheduleTime: z.string().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  srb: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email(),
  paymentProofName: z.string().optional(),
  paymentProofDataUrl: z.string().optional(),
});

type BookingRow = {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  provider: string;
  location: string;
  price: string;
  category: string;
  schedule_date: string;
  schedule_time: string;
  first_name: string;
  last_name: string;
  srb: string;
  mobile: string;
  email: string;
  payment_proof_name: string;
  status: string;
  created_at: string;
};

function formatBooking(row: BookingRow) {
  return {
    id: row.id,
    courseId: row.course_id,
    courseTitle: row.course_title,
    provider: row.provider,
    location: row.location,
    price: row.price,
    category: row.category,
    scheduleDate: row.schedule_date,
    scheduleTime: row.schedule_time,
    firstName: row.first_name,
    lastName: row.last_name,
    srb: row.srb,
    mobile: row.mobile,
    email: row.email,
    paymentProofName: row.payment_proof_name,
    status: row.status,
    createdAt: row.created_at,
  };
}

router.get('/', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const rows = db
    .prepare(
      `SELECT id, user_id, course_id, course_title, provider, location, price, category,
              schedule_date, schedule_time, first_name, last_name, srb, mobile, email,
              payment_proof_name, status, created_at
       FROM bookings WHERE user_id = ? ORDER BY created_at DESC`,
    )
    .all(user.id) as BookingRow[];

  res.json({ bookings: rows.map(formatBooking) });
});

router.post('/', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid booking data.' });
    return;
  }

  const d = parsed.data;
  const id = `TOBC-${randomUUID().slice(0, 8).toUpperCase()}`;

  db.prepare(
    `INSERT INTO bookings (
      id, user_id, course_id, course_title, provider, location, price, category,
      schedule_date, schedule_time, first_name, last_name, srb, mobile, email,
      payment_proof_name, payment_proof_data_url, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')`,
  ).run(
    id,
    user.id,
    d.courseId,
    d.courseTitle,
    d.provider ?? '',
    d.location ?? '',
    d.price ?? '',
    d.category ?? '',
    d.scheduleDate,
    d.scheduleTime,
    d.firstName,
    d.lastName,
    d.srb ?? '',
    d.mobile ?? '',
    d.email,
    d.paymentProofName ?? '',
    d.paymentProofDataUrl ?? '',
  );

  const row = db
    .prepare(
      `SELECT id, user_id, course_id, course_title, provider, location, price, category,
              schedule_date, schedule_time, first_name, last_name, srb, mobile, email,
              payment_proof_name, status, created_at
       FROM bookings WHERE id = ?`,
    )
    .get(id) as BookingRow;

  res.status(201).json({ booking: formatBooking(row) });
});

export default router;
