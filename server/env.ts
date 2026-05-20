import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvFile();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function parseOrigins(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const clientOrigins = parseOrigins(process.env.CLIENT_ORIGIN || 'http://localhost:3000');

export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me-before-deploying',
  cookieName: 'tobc_session',
  clientOrigins,
  clientOrigin: clientOrigins[0] ?? 'http://localhost:3000',
  cookieSameSite: (process.env.COOKIE_SAME_SITE === 'none' ? 'none' : 'lax') as 'lax' | 'none',
  dbPath: process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(rootDir, 'data', 'tobc.db'),
  nodeEnv: process.env.NODE_ENV || 'development',
};
