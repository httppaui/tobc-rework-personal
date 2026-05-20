# TOBC — Improvement roadmap

Living backlog for what to build or polish next. Update this file when priorities change or items ship (move to **Done** with date).

**Related docs:** [README.md](../README.md) · [UI-UX-PLAN.md](../UI-UX-PLAN.md) · [POLISH.md](./POLISH.md) · [GOOGLE-SIGNIN.md](./GOOGLE-SIGNIN.md)

---

## Current state (baseline)

| Area | Status |
|------|--------|
| Frontend | React 19 + Vite + TypeScript, routes (`/bookings`, `/profile`, `/settings`, `/messages`, …) |
| Auth | Express + SQLite, bcrypt, JWT httpOnly cookie, production CORS + `COOKIE_SAME_SITE` |
| Bookings | **Saved to API**; **My Bookings** page; modal submits when logged in |
| Wishlist / cart | **Synced per user** via API; merges guest localStorage on login |
| Live chat | **Persisted per user** when logged in; guest mode still uses local demo |
| Profile / Settings | **Profile** (name), **Settings** (password + legal links) |
| Deploy | See **[DEPLOY.md](./DEPLOY.md)** + `render.yaml` blueprint |

---

## Tier 1 — Core product (highest impact)

### 1. Real bookings

**Problem:** Booking modal ends with a local toast; no record in the database.

**Done when:**

- [x] `POST /api/bookings` + `GET /api/bookings`
- [x] SQLite `bookings` table
- [x] Booking modal submits to API when logged in
- [x] **My Bookings** page (`#/bookings`)
- [x] Confirmation id from server

**Files (likely):** `server/routes/bookings.ts`, `server/db.ts`, `src/pages/BookingsPage.tsx`, `BookingModal.tsx`, `AppProvider.tsx`

---

### 2. Wishlist & cart per account

**Problem:** Saved courses and cart are browser-only; lost on another device or after clearing storage.

**Done when:**

- [x] `GET/PUT /api/lists/wishlist` and `/api/lists/cart`
- [x] Load/sync on session restore
- [x] Merge guest localStorage on login/register

**Files (likely):** `server/routes/wishlist.ts`, `server/routes/cart.ts`, `src/lib/storage.ts`, `AppProvider.tsx`

---

### 3. Production auth

**Problem:** Auth works on `localhost` with `npm run dev`; production static host has no API unless configured.

**Done when:**

- [x] Deploy guide + Render blueprint (`docs/DEPLOY.md`, `render.yaml`)
- [x] Env: `JWT_SECRET`, `CLIENT_ORIGIN`, `COOKIE_SAME_SITE`, `DATABASE_PATH`
- [x] Frontend: `VITE_API_URL` documented
- [ ] **You:** deploy API + frontend and run smoke test on live URL

**See:** [DEPLOY.md](./DEPLOY.md)

---

## Tier 2 — Logged-in experience

### 4. Profile & settings pages

**Problem:** Profile menu items open toasts or only Privacy modal.

**Done when:**

- [x] `/profile` — edit name
- [x] `/settings` — change password + Terms & Privacy modals
- [x] Profile menu links to real pages

**Files (likely):** `ProfilePage.tsx`, `SettingsPage.tsx`, `ProfileMenu.tsx`, `App.tsx`, `routes.ts`

---

### 5. Mobile drawer (signed-in)

**Problem:** Drawer still shows **Register / Log In** when header shows profile menu.

**Done when:**

- [x] Logged-in drawer: Profile, Bookings, Messages, Log out
- [x] Guest: Register / Log In

**Files (likely):** `MobileDrawer.tsx`

---

### 6. Live chat backend (optional depth)

**Problem:** Chat is UI-only; random demo agent replies; no history across sessions.

**MVP:**

- [x] Persist threads/messages in SQLite per `user_id`
- [x] Load/send via API when logged in

**Later:**

- [ ] Real agent dashboard or third-party widget (Intercom, Crisp, etc.)
- [ ] Attachments, read receipts, push notifications

**Files (likely):** `server/routes/messages.ts`, `MessagesPage.tsx`, `chatSupport.ts`

---

## Tier 3 — Polish & trust

From [UI-UX-PLAN.md](../UI-UX-PLAN.md) — not blocking MVP, but improves perceived quality.

| Item | Notes |
|------|--------|
| Loading skeletons | Courses/Partners during filter/search (beyond “Updating results…” overlay) |
| Empty states | [x] Partners / News / Library aligned with Courses pattern (Phase C); Courses filters still open |
| Touch / tablet | ~44px tap targets on filters; collapsible filter sidebar on tablet |
| CSS cleanup | Migrate remaining inline styles (drawer, mobile rows) to `main.css` |
| CTA discipline | One primary action per hero region (teal = book / register / search) |
| Toast noise | Reduce info toasts on role switch, every search; keep success/error |

---

## Tier 4 — Later / optional

| Item | Notes |
|------|--------|
| Google Sign-In | [GOOGLE-SIGNIN.md](./GOOGLE-SIGNIN.md) — deferred |
| Agency / Training Center portals | Home CTAs still toast “Opening portal…” |
| Certificates page | Footer “My Certificates” → toast |
| Legal stubs | [x] Cookie, Disclaimer, Refund, Careers, Contact — legal modals (Phase C) |
| Display & accessibility | [x] Profile menu + Settings panel; `localStorage` text size + reduced motion |
| Partner registration | Partners page CTA |
| Real-time chat for agents | After MVP message persistence |

---

## Quick wins (≈ half day each)

- [x] Mobile drawer logged-in state
- [x] Footer **My Bookings** → `#/bookings`
- [x] README routes updated
- [ ] Message icon unread badge (optional)
- [x] Help FAB **Live Chat** → `/messages`

---

## Suggested implementation order

```text
1. Deploy API + fix production login          (Tier 1 #3)
2. Bookings API + My Bookings page            (Tier 1 #1)
3. Wishlist/cart on server                    (Tier 1 #2)
4. Profile + Settings + mobile drawer         (Tier 2 #4–5)
5. UI polish (skeletons, empty states)        (Tier 3)
6. Chat persistence or third-party            (Tier 2 #6)
7. Google / portals / certificates            (Tier 4)
```

---

## Done (shipped)

_Add a dated line when an item is completed._

| Date | Item |
|------|------|
| 2026-05-19 | Email/password auth API + SQLite |
| 2026-05-19 | Auth modal: terms checkbox, password rules popover, legal modals |
| 2026-05-19 | Profile dropdown (avatar, menu, logout inside) |
| 2026-05-19 | Live chat page UI (`/messages`) + nav message icon |
| 2026-05-19 | Toast position (top center); scroll jump fixes; chat bubble text contrast |
| 2026-05-19 | Roadmap Tier 1–2: bookings API, lists API, profile/settings pages, chat persistence, deploy docs, mobile drawer logged-in |

---

## How to use this doc

1. Pick the next unchecked box from **Tier 1** unless you’re explicitly doing polish only.
2. When you ship something, check the box and add a row under **Done**.
3. For UI-visible work, also append one line to **Implementation log** in [UI-UX-PLAN.md](../UI-UX-PLAN.md).
