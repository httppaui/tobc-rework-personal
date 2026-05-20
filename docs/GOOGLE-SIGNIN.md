# Google Sign-In setup for TOBC

> **Current app:** Auth uses **email and password** via the Express API (`server/`, SQLite, httpOnly cookie). This guide is for when you want to add Google later—not required for the personal MVP.

This app can use **Google Identity Services** (the official “Sign in with Google” button) via [`@react-oauth/google`](https://www.npmjs.com/package/@react-oauth/google). After sign-in, Google returns a **JWT credential**; the app decodes it in the browser to get the user’s name and email—no backend is required for the MVP.

If `VITE_GOOGLE_CLIENT_ID` is **not** set, the auth modal shows a **demo** button (simulated login). Setting the client ID enables the real Google button.

---

## What you need before you start

| Item | Notes |
|------|--------|
| Google account | Personal or Workspace |
| Access to [Google Cloud Console](https://console.cloud.google.com/) | To create a project and OAuth client |
| Local dev URL | **`http://localhost:3000`** (see `vite.config.ts` — not the default Vite 5173 port) |
| Production URL | Your deployed site origin, e.g. `https://your-app.vercel.app` |

---

## Part 1 — Google Cloud project

### Step 1. Open Google Cloud Console

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/).
2. Sign in with the Google account that will own the OAuth app.

### Step 2. Create or select a project

1. Use the **project** dropdown at the top of the page.
2. Click **New Project** (or pick an existing one).
3. Name it (e.g. `TOBC Web`) and click **Create**.
4. Wait until the project is active, then select it from the dropdown.

### Step 3. Configure the OAuth consent screen

You must do this **before** creating credentials.

1. Open **APIs & Services** → **OAuth consent screen**  
   ([direct link](https://console.cloud.google.com/apis/credentials/consent)).
2. Choose user type:
   - **External** — any Google user can sign in (typical for TOBC).
   - **Internal** — only users in your Google Workspace organization.
3. Click **Create** (if starting fresh).
4. Fill in **App information** (required for External):
   - **App name:** e.g. `TOBC — The Online Booking Corp`
   - **User support email:** your email
   - **Developer contact email:** your email
5. Click **Save and Continue**.
6. **Scopes:** click **Save and Continue** (default is fine; Sign-In uses `openid`, `email`, `profile` via the button).
7. **Test users** (only while app is in **Testing**):
   - Add Gmail addresses that will sign in during development.
   - Users not on this list will see *“Access blocked: app has not completed Google verification”* until you publish the app.
8. **Summary** → **Back to Dashboard**.

> **Publishing:** For a small MVP you can stay in **Testing** and add test users. For public launch, submit the app for verification or move to production per Google’s policy.

---

## Part 2 — Create OAuth 2.0 credentials

### Step 4. Create a Web client ID

1. Go to **APIs & Services** → **Credentials**  
   ([direct link](https://console.cloud.google.com/apis/credentials)).
2. Click **+ Create Credentials** → **OAuth client ID**.
3. If prompted to configure the consent screen, finish Part 1 first.
4. **Application type:** **Web application**.
5. **Name:** e.g. `TOBC Web Client`.

### Step 5. Authorized JavaScript origins

Under **Authorized JavaScript origins**, click **+ Add URI** and add **every origin** where the app runs (scheme + host + port, no path):

| Environment | URI to add |
|-------------|------------|
| Local dev | `http://localhost:3000` |
| Production | `https://your-production-domain.com` |

Examples:

```
http://localhost:3000
https://tobc.vercel.app
```

Rules:

- Use **`http`** for localhost, **`https`** for production.
- **No trailing slash** (`https://example.com/` is wrong).
- **No path** (`https://example.com/app` is wrong).
- Port must match exactly (`3000` for this repo’s `npm run dev`).

### Step 6. Authorized redirect URIs (optional for this app)

TOBC uses the **Google Sign-In button** with a **credential (JWT) callback** in the browser. You typically **do not** need redirect URIs for that flow.

If Google still asks for them, you can add:

```
http://localhost:3000
https://your-production-domain.com
```

Do **not** use hash routes like `#/home` in redirect URIs.

### Step 7. Save and copy the Client ID

1. Click **Create**.
2. Copy the **Client ID** (ends with `.apps.googleusercontent.com`).
3. Keep the **Client secret** private; this frontend flow does **not** use the secret in the browser.

---

## Part 3 — Configure the TOBC project

### Step 8. Create a local `.env` file

1. In the project root (`TOBC/`), copy the example file:

   **Windows (PowerShell):**
   ```powershell
   Copy-Item .env.example .env
   ```

   **macOS / Linux:**
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and set:

   ```env
   VITE_GOOGLE_CLIENT_ID=123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
   ```

   Replace the value with your real Client ID. No quotes needed.

3. Confirm `.env` is **not** committed to git (it should be in `.gitignore`). Only commit `.env.example` without secrets.

### Step 9. Restart the dev server

Vite reads env vars at startup.

1. Stop the running dev server (`Ctrl+C` in the terminal).
2. Start again:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

### Step 10. Verify the UI switched to real Google login

1. Click **Register Free**, **Log In**, or **Create account** (or try to **Book** a course while logged out).
2. In the auth modal you should see:
   - **Google’s official button** (not the gray demo button with Bootstrap icon).
   - No demo hint about `VITE_GOOGLE_CLIENT_ID`.
3. Click the Google button, choose an account, and approve.
4. You should see a success toast and your **name** in the header (from your Google profile).

**Auth modal modes** (same Google button, different label):

| How you opened it | Modal title | Google button text |
|-------------------|-------------|-------------------|
| Log In | Log in to your account | Sign in with Google |
| Register Free / Create account | Create your free account | Sign up with Google |
| Book while logged out | Sign in to book this course | Continue with Google |

---

## Part 4 — Production deployment (e.g. Vercel)

### Step 11. Add the client ID on your host

Do **not** rely on `.env` in git for production.

1. In your host’s dashboard (Vercel: **Project → Settings → Environment Variables**), add:

   | Name | Value |
   |------|--------|
   | `VITE_GOOGLE_CLIENT_ID` | Your Client ID |

2. Apply to **Production** (and Preview if you use preview URLs).

3. Add the **production origin** to Google Console **Authorized JavaScript origins** (Step 5), e.g.:

   ```
   https://your-app.vercel.app
   ```

4. Redeploy after changing env vars.

### Step 12. Preview deployments

Each preview URL (e.g. `https://tobc-git-feature-xxx.vercel.app`) must be added as its **own** JavaScript origin in Google Console, or sign-in will fail on that URL.

---

## Part 5 — How it works in this codebase (reference)

| File | Role |
|------|------|
| `src/main.tsx` | Wraps the app in `GoogleOAuthProvider` when `VITE_GOOGLE_CLIENT_ID` is set |
| `src/lib/googleAuth.ts` | Reads client ID; decodes JWT → `AuthUser` |
| `src/components/AuthModal.tsx` | Renders `GoogleLogin` or demo button |
| `src/context/AppProvider.tsx` | `loginWithGoogleCredential()` saves user to `localStorage` |

Flow:

```
User clicks Google button
  → Google popup / account chooser
  → onSuccess(credential JWT)
  → userFromGoogleCredential()
  → setUser + localStorage + close modal (+ resume booking if applicable)
```

---

## Troubleshooting

### Demo button still appears (“Set VITE_GOOGLE_CLIENT_ID…”)

| Cause | Fix |
|--------|-----|
| `.env` missing or empty | Create `.env` and set `VITE_GOOGLE_CLIENT_ID` |
| Dev server not restarted | Stop and run `npm run dev` again |
| Typo in variable name | Must be exactly `VITE_GOOGLE_CLIENT_ID` (Vite only exposes `VITE_*`) |
| Extra spaces/quotes | Use plain value, no surrounding quotes |

### “Error 400: redirect_uri_mismatch” or origin errors

| Cause | Fix |
|--------|-----|
| Wrong origin in Google Console | Add exact origin: `http://localhost:3000` (check browser address bar port) |
| Using `5173` but app runs on `3000` | This repo uses port **3000** in `vite.config.ts` |
| `https` vs `http` | Localhost must be `http://` |
| Trailing slash on origin | Remove trailing `/` |

### “Access blocked: This app’s request is invalid”

- Client ID copied incorrectly or from wrong project.
- Origins not saved in the same OAuth client as the Client ID.

### “Google hasn’t verified this app” / only some accounts work

- App is in **Testing** on the consent screen → add the Gmail address under **Test users**, or publish the app.

### Sign-in cancelled or failed toast

- User closed the popup — try again.
- Third-party cookies / extensions blocking Google — try incognito or another browser.

### Works locally, fails in production

- Production URL not listed under **Authorized JavaScript origins**.
- `VITE_GOOGLE_CLIENT_ID` not set in hosting env vars, or deploy happened before the variable was added → redeploy.

### Build works but button does nothing

- Open browser **DevTools → Console** for errors from `accounts.google.com`.
- Confirm `GoogleOAuthProvider` wraps the app (`src/main.tsx`) — only when client ID is non-empty.

---

## Security notes (MVP)

- The **Client ID** is public in the frontend; that is expected.
- Never put the **Client secret** in frontend code or `VITE_*` variables.
- The JWT is decoded client-side for display and `localStorage` only. For a production backend, verify the token on the server with [Google’s token verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).

---

## Quick checklist

- [ ] Google Cloud project created  
- [ ] OAuth consent screen configured  
- [ ] OAuth **Web application** client created  
- [ ] `http://localhost:3000` added to **Authorized JavaScript origins**  
- [ ] Production origin added (when deploying)  
- [ ] `.env` contains `VITE_GOOGLE_CLIENT_ID=...`  
- [ ] Dev server restarted  
- [ ] Test user added (if app is in Testing mode)  
- [ ] Auth modal shows Google’s button and login succeeds  

---

## Related files in the repo

- `.env.example` — template for local env  
- `package.json` — dependency `@react-oauth/google`  
- `UI-UX-PLAN.md` — implementation log entry for Google Sign-In  
