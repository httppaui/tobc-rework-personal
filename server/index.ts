import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './env.js';
import './db.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'tobc-api' });
});

app.use('/api/auth', authRoutes);

app.listen(env.port, () => {
  console.log(`TOBC API listening on http://localhost:${env.port}`);
  console.log(`CORS origin: ${env.clientOrigin}`);
  console.log(`Database: ${env.dbPath}`);
});
