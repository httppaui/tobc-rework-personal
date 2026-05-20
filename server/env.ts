import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me-before-deploying',
  cookieName: 'tobc_session',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  dbPath: process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(rootDir, 'data', 'tobc.db'),
  nodeEnv: process.env.NODE_ENV || 'development',
};
