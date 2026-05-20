import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './env.js';
import './db.js';
import authRoutes from './routes/auth.js';
import bookingsRoutes from './routes/bookings.js';
import listsRoutes from './routes/lists.js';
import messagesRoutes from './routes/messages.js';
import profileRoutes from './routes/profile.js';

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'tobc-api', env: env.nodeEnv });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messagesRoutes);

app.listen(env.port, () => {
  console.log(`TOBC API listening on http://localhost:${env.port}`);
  console.log(`CORS origins: ${env.clientOrigins.join(', ')}`);
  console.log(`Cookie sameSite: ${env.cookieSameSite}`);
  console.log(`Database: ${env.dbPath}`);
});
