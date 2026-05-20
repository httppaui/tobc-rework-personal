import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { env } from './env.js';

const dir = path.dirname(env.dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database(env.dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
};
