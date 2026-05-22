# Deploying TOBC (frontend + API)

**CI/CD (GitHub Actions):** [CI-CD.md](./CI-CD.md)

## Overview

| Part | Host example | Build / start |
|------|----------------|---------------|
| Frontend | Vercel, Netlify | `npm run build` → `dist/` |
| API | Render, Railway, Fly.io | `npm run start:api` |

The browser must call the API with **cookies** (`credentials: 'include'`). When frontend and API are on **different domains**, configure CORS and cookies as below.

---

## 1. API environment variables

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=https://your-app.vercel.app
COOKIE_SAME_SITE=none
DATABASE_PATH=/data/tobc.db
```

- **CLIENT_ORIGIN** — Exact frontend URL (no trailing slash). Multiple origins: comma-separated, e.g. `https://app.vercel.app,https://www.yoursite.com`
- **COOKIE_SAME_SITE=none** — Required for cross-site cookies (frontend ≠ API host). API must be served over **HTTPS**.

---

## 2. Frontend environment variables

On Vercel (or your static host), set at **build** time:

```env
VITE_API_URL=https://your-api.onrender.com
```

Rebuild after changing. In local dev, leave `VITE_API_URL` empty; Vite proxies `/api` to port 3001.

---

## 3. Render example (API)

1. New **Web Service** → connect repo.
2. **Build command:** `npm install`
3. **Start command:** `npm run start:api`
4. Add env vars from section 1.
5. Add a **disk** mount at `/data` if you use `DATABASE_PATH=/data/tobc.db`.

Health check path: `/api/health`

---

## 4. Vercel example (frontend)

1. Import repo; framework **Vite**.
2. Build: `npm run build` · Output: `dist`
3. **Environment variable (required for login/booking):** `VITE_API_URL` = your API URL (e.g. `https://tobc-api.onrender.com`). Apply to **Production** (and Preview if you test PRs).
4. **When the API is ready:** also set `VITE_AUTH_ENABLED=true` (sign-in is off in production by default until then).
5. Redeploy after saving env vars (Vite bakes `VITE_*` at build time).

**Without `VITE_API_URL`,** the live site calls `/api` on the Vercel domain, which only serves the React app (HTML), so sign-in shows “Something went wrong.”

For [https://tobc-rework-personal.vercel.app/](https://tobc-rework-personal.vercel.app/), the API must also allow that origin:

```env
CLIENT_ORIGIN=https://tobc-rework-personal.vercel.app
COOKIE_SAME_SITE=none
```

---

## 5. Quick checklist (Vercel + Render)

| Step | Where | What |
|------|--------|------|
| 1 | Render | Web service running `npm run start:api`, disk at `/data`, env from section 1 |
| 2 | Render | Open `https://YOUR-SERVICE.onrender.com/api/health` → `{"ok":true,"service":"tobc-api",...}` |
| 3 | Vercel | `VITE_API_URL` = same API origin (no trailing slash) |
| 4 | Vercel | Redeploy production |
| 5 | Live app | Create account → refresh → still logged in |

---

## 6. Smoke test (production)

1. Open `https://your-api.onrender.com/api/health` → `{ "ok": true }`
2. Open the live app → **Create account** → refresh → still logged in
3. Book a course → **My Bookings** shows the record
4. Add wishlist → sign out → sign in → wishlist restored

---

## 7. Local full stack

```bash
cp .env.example .env
# Edit JWT_SECRET
npm install
npm run dev
```

App: http://localhost:3000 · API: http://localhost:3001
