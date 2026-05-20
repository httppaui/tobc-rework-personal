# TOBC — The Online Booking Corp

Maritime training marketplace MVP built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS v4**, plus a small **Express + SQLite** API for authentication.

## Development

### 1. Install and configure

```bash
npm install
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET` (any long random string).

### 2. Run app + API together

```bash
npm run dev
```

This starts:

| Service | URL |
|---------|-----|
| React app (Vite) | [http://localhost:3000](http://localhost:3000) |
| API (Express) | [http://localhost:3001](http://localhost:3001) |

Vite proxies `/api/*` to the API. Accounts are stored in `data/tobc.db` (SQLite).

### Sign in

Use **Log In** or **Create account** in the header or home page. Sessions use an **httpOnly cookie** (7 days). Passwords are hashed with bcrypt on the server.

If you see *“Cannot reach the server”*, ensure `npm run dev` is running (both web and api). Check [http://localhost:3001/api/health](http://localhost:3001/api/health).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Frontend + API (recommended) |
| `npm run dev:web` | Vite only |
| `npm run dev:api` | API only |
| `npm run start:api` | API without file watch |

## Build

```bash
npm run build
npm run preview
```

Frontend output is in `dist/`. The API is not bundled into `dist/`—deploy it separately (see below).

## Deploying

**Frontend** (e.g. Vercel): static `dist/` as today.

**API** (e.g. Railway, Render, Fly.io):

1. Run `npm run start:api` with env vars from `.env.example`.
2. Set `CLIENT_ORIGIN` to your production site URL (e.g. `https://your-app.vercel.app`).
3. Set `JWT_SECRET` to a strong secret.
4. On the frontend host, set `VITE_API_URL` to your API origin (e.g. `https://tobc-api.onrender.com`) and rebuild.

Google Sign-In is optional later; see **[docs/GOOGLE-SIGNIN.md](docs/GOOGLE-SIGNIN.md)**.

**Project overview (requirements, architecture, phases, sync workflow):** **[docs/PROJECT.md](docs/PROJECT.md)**.

**UI/UX plan:** **[docs/UI-UX-PLAN.md](docs/UI-UX-PLAN.md)**. **What to build next:** **[docs/ROADMAP.md](docs/ROADMAP.md)**. **Deploy:** **[docs/DEPLOY.md](docs/DEPLOY.md)**.

## Project structure

| Path | Purpose |
|------|---------|
| `src/` | React app (pages, components, context, data) |
| `server/` | Express API (auth, SQLite) |
| `data/` | SQLite database (gitignored) |
| `public/` | Static assets (logo, puzzle SVG, JSON) |
| `assets/styles/main.css` | Main design system CSS |

## API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create account `{ name, email, password }` |
| POST | `/api/auth/login` | Log in `{ email, password }` |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/me` | Current user (requires cookie) |
| GET/POST | `/api/bookings` | List / create bookings (auth) |
| GET/PUT | `/api/lists/wishlist`, `/api/lists/cart` | Per-user lists (auth) |
| GET/PATCH/POST | `/api/profile`, `/api/profile/password` | Profile & password (auth) |
| GET/POST | `/api/messages/threads`, `.../messages` | Chat (auth) |

## Routes

Hash-based routing:

- `#/home`, `#/courses`, `#/partners`, `#/about`, `#/news`, `#/library`, `#/wishlist`, `#/cart`, `#/messages`, `#/bookings`, `#/profile`, `#/settings`

## About puzzle

Interactive four-piece puzzle on the About page. Copy lives in `src/data/aboutPuzzle.json`.
