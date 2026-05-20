# CI/CD — GitHub Actions

## Overview

| Workflow | File | When it runs |
|----------|------|----------------|
| **CI** | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Every push and PR to `master` |
| **Deploy** | [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | After CI succeeds on `master`, or manual **Run workflow** |

CI validates TypeScript (frontend + API), builds `dist/`, and smoke-tests the API (`/api/health`).

Deploy is **optional** until you add GitHub secrets (see below). Without secrets, the deploy job finishes with a notice and does not fail.

---

## CI jobs

1. **Build & typecheck** — `npm ci` → `typecheck` → `typecheck:server` → `build` → upload `dist/` artifact  
2. **API smoke test** — starts `npm run start:api`, polls `http://localhost:3001/api/health`

Run the same checks locally:

```bash
npm run ci
```

Node version matches [`.nvmrc`](../.nvmrc) (22).

---

## Enable production deploy (CD)

Create a GitHub **environment** named `production` (Settings → Environments) if you want protection rules or required reviewers.

### Frontend — Vercel

1. Import the repo in [Vercel](https://vercel.com) (or use an existing project).
2. In Vercel: **Settings → General** copy **Project ID**; **Settings →** team **ID** = Org ID.
3. Create a [Vercel token](https://vercel.com/account/tokens).
4. Add repository secrets:

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | Personal access token |
| `VERCEL_ORG_ID` | Team / user ID |
| `VERCEL_PROJECT_ID` | Project ID |
| `VITE_API_URL` | Production API URL (e.g. `https://tobc-api.onrender.com`) — used at build time |

The deploy workflow runs `npm run build` with `VITE_API_URL`, then `vercel-action` with `--prod`.

You can instead connect Vercel to GitHub for deploys and use **CI only** in Actions; skip `VERCEL_*` secrets if Vercel handles CD.

### API — Render

1. Create the API service from [`render.yaml`](../render.yaml) or the [Render dashboard](https://render.com).
2. In Render: **Settings → Deploy Hook** → copy URL.
3. Add secret:

| Secret | Value |
|--------|--------|
| `RENDER_DEPLOY_HOOK_URL` | Deploy hook URL |

Render runs `npm install` and `npm run start:api` on its side; the hook only triggers a new deploy.

---

## Branch protection (recommended)

On `master`, require status checks before merge:

- **Build & typecheck**
- **API smoke test**

---

## Manual deploy

**Actions → Deploy → Run workflow** on `master`. Configure secrets first; the job builds with `VITE_API_URL` when deploying to Vercel.

---

## Related docs

- [DEPLOY.md](./DEPLOY.md) — env vars, CORS, cookies, smoke tests in production  
- [render.yaml](../render.yaml) — Render Blueprint for the API  
- [vercel.json](../vercel.json) — Vercel build output and SPA rewrites  
