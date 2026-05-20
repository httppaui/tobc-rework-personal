# TOBC — UI/UX plan (living document)

This file is the **source of truth** for UI/UX direction for the TOBC site (**React + TypeScript + Tailwind** in `src/`, Vite entry `index.html`).

**Auto-sync:** Cursor applies [`.cursor/rules/tobc-ui-ux-sync.mdc`](.cursor/rules/tobc-ui-ux-sync.mdc) when those files are in context — the agent should update this doc (checklists + **Implementation log**) after material UI/UX edits. True filesystem watchers are not used; the rule drives habit in-agent.

---

## Current baseline

- **Design tokens**: `:root` in `assets/styles/main.css` — brand palette (Navy `#004762`, Deep Sea `#00555e`, Teal `#28a5a8`, Sky `#b9e5fb`, Orange `#FF7500`, Ochre `#fdba61`, Ivory `#fffce8`) mapped to semantic `--teal-*`, `--amber`, `--paper`.
- **Code layout**: `src/components/`, `src/pages/`, `src/context/`, `src/data/`, `public/assets/`; legacy `assets/styles/main.css` + `legacy-tobc.html` kept for reference.
- **Typography**: Montserrat (headings), DM Sans (body).
- **Chrome**: Sticky nav + global search bar + role quick bar + dropdowns + mobile drawer + bottom nav — high density above the fold.
- **Pages** (SPA): `page-home`, `page-courses`, `page-partners`, `page-about`, `page-news`, `page-library`. Entry: **`index.html`** (root).
- **Debt**: Many inline `style=""` blocks in `index.html` — migrate to classes over time.

---

## 1. Information architecture and navigation

| Item | Status | Notes |
|------|--------|--------|
| Clarify global search vs Courses search (copy / pre-fill / visibility) | [x] | Hint text updated; global search still pre-fills Courses (`runGlobalSearch`). |
| Consistent breadcrumbs on Partners, News, Library, About | [x] | Already matched Courses; added `aria-current="page"`. |
| Deep links + browser Back (`hash` or `history.pushState`) | [x] | Hash routes `#/page` and `#/page/filter` + `hashchange` (`tobc.js`). |
| Mobile bottom nav matches full IA (or Home / Courses / More) | [x] | Home · Courses · Partners · More (`data-mbn-page` + `openDrawer`). |
| Active state on mobile drawer for current section | [x] | `data-nav-page` + `.is-current-route` (`syncDrawerNavHighlight`). |

---

## 2. Visual system (clean = fewer exceptions)

| Item | Status | Notes |
|------|--------|--------|
| Spacing + type scale tokens in `:root` | [x] | Added `--space-1` … `--space-6` (use incrementally in CSS). |
| Migrate inline styles → `tobc.css` classes | ☐ | Drawer, mobile rows, etc. |
| One primary CTA per major region | ☐ | Teal reserved for book / register / search |
| List/grid course cards: rhythm, whitespace, image ratio | ☐ | List layout fixed; keep tuning |
| Optional: SVG icon set instead of emoji for chrome | [x] | **Bootstrap Icons** (CDN) replace emoji across chrome, cards, toasts, FAB, footer social (`tobc.html` / `tobc.css` / `tobc.js`). |

---

## 3. Accessibility

| Item | Status | Notes |
|------|--------|--------|
| `:focus-visible` on nav, cards, filters, toggles | [x] | Nav, role tabs, view toggle, MBN, book btn, drawer rows, filter headers, partner/news tabs; booking close button. |
| Escape closes menus / overlays | [x] | `initEscapeKey`: booking, drawer, help, onboarding, nav dropdowns (`tobc.js`). |
| `prefers-reduced-motion` for hovers / page fade / toasts | [x] | `tobc.css` media block. |
| Prefer real links where possible (`href` + enhancement) | ☐ | SEO + a11y |

---

## 4. Page-level priorities

| Page | Focus |
|------|--------|
| Home | Single hero CTA; don’t fight global search |
| Courses | Sticky filter context; empty state when zero results |
| Booking modal | Steps clear; total early; obvious close |
| Partners / News / Library | Card rhythm aligned with Courses |
| Footer | Branding aligned with header; legal grouped |

---

## 5. Feedback and trust

| Item | Status | Notes |
|------|--------|--------|
| Toasts: avoid noise on trivial toggles (e.g. grid/list) | [x] | Removed grid/list view toasts (`setView`). |
| Loading: skeleton or pulse during filter | ☐ | Beyond “Updating results…” overlay |
| Trust: one MARINA / verification strip near booking | [x] | `.booking-trust-strip` under booking breadcrumb. |

---

## 6. Responsive

| Item | Status | Notes |
|------|--------|--------|
| 1024–1280: sidebar + grid + bars — consider collapsible filters | ☐ | Tablet |
| Touch targets ~44px for filters / view toggle | ☐ | Mobile |

---

## Phased delivery

1. **Phase 0** — Routing/history; search IA; mobile nav parity.  
2. **Phase 1** — Tokens; inline → CSS; focus + reduced motion.  
3. **Phase 2** — Icons, skeletons, empty states, microcopy.

---

## Definition of done (site-wide)

- No unintended horizontal scroll on common breakpoints for main flows.
- User knows **where they are**, **next step**, and **how to go back** (including browser Back when routing exists).
- Coherent spacing, type, and buttons; minimal inline exceptions.
- Keyboard users can browse → filter → booking without traps.

---

## Implementation log

_Add a bullet with **YYYY-MM-DD** when you ship a meaningful UI/UX change (what changed, files touched)._

- **2026-05-11 — Handoff (blocked in Plan mode):** Plan mode could not edit non-markdown files; see below for completed Agent implementation.

- **2026-05-11 — Appendix A shipped (Agent):** Hash routing (`#/courses`, `#/partners/training`), `navigate(..., { fromHash })`, `initEscapeKey`, `syncDrawerNavHighlight`, mobile bottom nav (Home / Courses / Partners / More) + `data-mbn-page`, drawer `data-nav-page` + current-route styling, global search hint copy, booking trust strip, breadcrumb `aria-current`, `:focus-visible` + `prefers-reduced-motion`, `--space-*` tokens, silent grid/list toggle. Files: `tobc.js`, `tobc.html`, `tobc.css`, `UI-UX-PLAN.md`.

- **2026-05-11 — Bootstrap Icons (no emoji):** Replaced decorative emoji / unicode symbols with Bootstrap Icons (`<i class="bi …">`): nav actions, drawer, hero, steps, course/partner/news/library cards, ratings (star icons), filters/FAQ chevrons, view toggle, pagination, footer + social, help FAB, booking step check/close, course search icons in `.cs-input-wrap`; toasts + role hero CTAs in `tobc.js`. Supporting sizes in `tobc.css`. Files: `tobc.html`, `tobc.css`, `tobc.js`, `UI-UX-PLAN.md`.

- **2026-05-18 — Onboarding overlay reliability:** Show overlay via inline head script + `html.tobc-show-onboard` before deferred JS; init on `DOMContentLoaded` instead of `window.load`; safe `localStorage` helpers; body scroll lock; `?onboard=reset` clears flag for retesting. Files: `tobc.html`, `tobc.css`, `tobc.js`, `UI-UX-PLAN.md`.

- **2026-05-19 — About Us interactive puzzle:** Four interlocking puzzle pieces (PNG assets) with corner captions; click opens modal with full Platform / Mission / Story / Vision copy; backdrop blur + section dim; Escape to close. Files: `tobc.html`, `tobc.css`, `tobc.js`, `assets/about/*.png`, `UI-UX-PLAN.md`.

- **2026-05-19 — Puzzle alignment fix:** Single `puzzle-complete.png` with transparent hit-layer buttons (replaces four separate PNGs in grid) so pieces interlock like reference artwork. Files: `index.html`, `tobc.css`, `assets/about/puzzle-complete.png`.

- **2026-05-19 — React + TypeScript + Tailwind migration:** Vite app with HashRouter (`#/home` … `#/library`), layout chrome (nav, role bar, drawer, MBN, booking modal, onboarding, toasts, help FAB), six pages, About puzzle component + modal (`AboutPuzzle.tsx`, `about-puzzle.css`, `src/data/aboutPuzzle.json`). Brand tokens in `src/index.css` `@theme`. Files: `package.json`, `vite.config.ts`, `src/**`, `public/**`, `vercel.json`, `README.md`, `UI-UX-PLAN.md`.

- **2026-05-19 — About puzzle interlocking fix:** Replaced flat/broken placeholder SVG with matching jigsaw paths; inline SVG + hover dim/scale on paths (removed misaligned sprite layers). Files: `AboutPuzzle.tsx`, `puzzle-complete.svg`, `main.css`.

- **2026-05-19 — Restore original layout in React:** Re-import `assets/styles/main.css` (original TOBC design system); rebuild chrome (`SiteHeader` with 3-column nav, global search bar, role quick bar), footer, MBN, drawer, booking modal, home hero/search/stats/courses, page heroes. Files: `src/index.css`, `src/components/layout/*`, `src/pages/*`, `assets/styles/main.css`.

- **2026-05-19 — Modular JS/CSS structure:** Split monolith into `js/app.js`, `components/*`, `services/*`, `utils/*`; styles → `assets/styles/main.css`; images → `assets/images/`; About copy → `assets/data/about-puzzle.json`. Files: project-wide.

- **2026-05-19 — About puzzle scale & labels:** Larger puzzle grid (560px desktop); piece labels centered in each quadrant. Files: `assets/styles/main.css`, `index.html`.

- **2026-05-19 — Brand color palette:** Official 8-color palette applied site-wide via `:root` tokens; puzzle/modal accents (Navy, Orange, Ochre, Teal). Files: `assets/styles/main.css`, `assets/data/about-puzzle.json`, `index.html`, `UI-UX-PLAN.md`.

- **2026-05-19 — About puzzle jigsaw silhouettes:** Full interlocking artwork via `puzzle-complete.png` in SVG viewBox; hover lifts piece using traced clip paths (tabs/blanks per quadrant); removed square quadrant sprite layers. Files: `AboutPuzzle.tsx`, `puzzlePaths.ts`, `main.css`, `public/assets/images/about/puzzle-complete.png`, `UI-UX-PLAN.md`.

- **2026-05-19 — About puzzle per-piece SVGs:** Four vector piece files (`puzzle-piece-platform|mission|story|vision.svg`) with circular tabs/blanks; React renders inline paths + hover scale/dim; `puzzle-complete.svg` composes the set. Files: `AboutPuzzle.tsx`, `puzzlePaths.ts`, `public/assets/images/about/puzzle-piece-*.svg`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Home course search centering:** Moved search card into hero `.container`; full-width grid (`minmax` columns + `width:100%` inputs); overlap stats with negative margin. Files: `HomePage.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Home stats spacing:** Reduced search card overlap (`-28px`) and increased stats bar top padding (`96px`) so numbers sit lower with clearer separation from search. Files: `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Home search/stats stack:** Removed overlap (no negative margin on search card); hero bottom padding + normal stats bar padding. Files: `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Nav dropdown hover + click navigate:** Courses/Partners/News menus open on `:hover`/`:focus-within`; label click routes to page (matches legacy `nav.js`). Files: `SiteHeader.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Courses page original layout:** Hero, sticky search toolbar, sidebar filters, results grid/list toggle, pagination, 12 sample courses; matches `legacy-tobc.html` structure. Files: `CoursesPage.tsx`, `CoursesFilters.tsx`, `courses.ts`, `CourseCard.tsx`, `UI-UX-PLAN.md`.

- **2026-05-19 — Courses filter sidebar polish:** Row layout checkbox + label + right-aligned mono counts; accordion header chevron; matches original filter card design. Files: `CoursesFilters.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — About puzzle hover alignment fix:** Absolute 400×400 paths from outer corners (was broken translate for TR/BL/BR); removed hover scale (kept dim + drop-shadow only). Files: `puzzlePaths.ts`, `AboutPuzzle.tsx`, `puzzle-piece-*.svg`, `main.css`.

- **2026-05-19 — About puzzle redo (reference art):** Paths match reference interlock (TL/BL tabs, TR/BR tabs/holes); hover = colored glow + translateY(-10px) on full piece; reference PNGs in `public/assets/images/about/`; removed white dim overlay. Files: `AboutPuzzle.tsx`, `puzzlePaths.ts`, `main.css`, `puzzle-piece-*.svg`, `puzzle-complete.png`.

- **2026-05-19 — About puzzle center icons:** Google Material Symbols per piece (hub, rocket_launch, auto_stories, public); clipped to piece shape; `icon` in `aboutPuzzle.json`. Files: `AboutPuzzle.tsx`, `PuzzlePieceIcon.tsx`, `index.html`, `main.css`, `aboutPuzzle.json`.

- **2026-05-19 — Nav dropdown open + item clicks:** `NavDropdown` with hover (`is-dropdown-open`) and first-click open / second-click navigate on labels; menu items navigate with filters (`?filter=stcw`, partner `?type=`); bridge + z-index so submenu stays clickable. Files: `NavDropdown.tsx`, `SiteHeader.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Partners sidebar filters:** Profession (Maritime), Partner Type (incl. Others specify), Country by continent, Philippines regions, Metro Manila/Cebu/Davao; sidebar + working filter logic on Partners page. Files: `PartnersPage.tsx`, `PartnersFilters.tsx`, `partners.ts`, `partnerFilterOptions.ts`, `partnerFilters.ts`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Course detail + booking flow:** Click course → detail modal (wishlist, cart, book now); guest book → Google sign-in → 4-step booking modal (schedule, details, payment screenshot, confirmation); cart/wishlist pages + nav badges. Files: `AppProvider.tsx`, `CourseDetailModal.tsx`, `AuthModal.tsx`, `BookingModal.tsx`, `WishlistPage.tsx`, `CartPage.tsx`, `CourseCard.tsx`, `SiteHeader.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Partners Country/Region lists complete:** Full continent country lists (Asia, Middle East, Europe, Africa, North America, South America, Oceania); all 18 PH administrative regions incl. NIR and BARMM. Files: `countriesByContinent.ts`, `philippinesRegions.ts`, `partnerFilterOptions.ts`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Google Sign-In (OAuth):** `@react-oauth/google` with `GoogleOAuthProvider` + official `GoogleLogin` button in auth modal (`signin_with` / `signup_with` / `continue_with` by mode); JWT → user profile; demo fallback when `VITE_GOOGLE_CLIENT_ID` unset. Files: `main.tsx`, `AuthModal.tsx`, `AppProvider.tsx`, `googleAuth.ts`, `.env.example`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Email/password auth (local):** Replaced Google sign-in with register/login forms; accounts + hashed passwords in `localStorage`; auth modal fields + booking pending preserved when switching login/register. Files: `AuthModal.tsx`, `AppProvider.tsx`, `localAuth.ts`, `main.tsx`, `main.css`, `types`, `storage.ts`, `README.md`, `UI-UX-PLAN.md`.

- **2026-05-19 — Auth API backend:** Express + SQLite (`server/`), bcrypt passwords, JWT httpOnly cookie; Vite `/api` proxy; `authApi.ts` + session restore on load. Files: `server/**`, `authApi.ts`, `AppProvider.tsx`, `vite.config.ts`, `package.json`, `.env.example`, `README.md`, `UI-UX-PLAN.md`.

- **2026-05-19 — Guest onboarding guide:** Welcome overlay shows for guests on each visit (session dismiss); hidden when logged in; body scroll lock + Escape to skip. Files: `AppProvider.tsx`, `Onboarding.tsx`, `Layout.tsx`, `UI-UX-PLAN.md`.

---

## Appendix A — Code implementation checklist (Agent mode)

Apply in this order.

### A1. `tobc.js` — Hash routing

- Add `ROUTE_PAGES`, `parseRouteFromHash()`, `setRouteHash(page, filter)`, `initHashRouter()` (`hashchange` + initial parse if not home).
- Extend `navigate(page, filter, opts = {})`: accept `{ fromHash: true }`; when absent, call `setRouteHash` after DOM update; use `behavior: 'auto'` for `scrollTo` when `fromHash`.
- Escape `filter` when querying `filterPartners` / `filterNews` buttons if the string contains quotes.
- Add `syncDrawerNavHighlight(page)` toggling class `is-current-route` on `.mobile-nav-row[data-nav-page]`.
- Replace `syncMobileNav` to use `.mbn-item[data-mbn-page="${page}"]` instead of index map.
- Add `initEscapeKey()` on `document`: **Escape** closes booking overlay, mobile drawer, help panel, onboarding (and sets onboarded flag), then closes nav dropdowns (`is-dropdown-open`).
- In `setView`, **remove** toasts for grid/list (silent toggle).
- In `window.addEventListener('load', …)` call `initHashRouter()` and `initEscapeKey()` early (before or after existing init).

### A2. `tobc.html` — Mobile bottom nav + drawer + copy

- **Global search hint** (line ~109): e.g. _“Fills the course search on the Courses page, then runs the search.”_
- **Bottom nav** (`mbn-grid`): four items with `data-mbn-page`: `home`, `courses`, `partners`; fourth **More** → `openDrawer()` (replace Bookings/Profile or repurpose).
- **Drawer** `mobile-nav-row`: add `data-nav-page="courses|partners|about|news|library"` on each page row.

### A3. `tobc.css`

- `.mobile-nav-row.is-current-route` — teal color / font-weight for current page in drawer.
- **Spacing tokens** (optional): e.g. `--space-1` … `--space-6` in `:root`.
- **`prefers-reduced-motion`**: disable `.page` keyframe, heavy `transform` on hovers (`btn`, `.course-card`), shorten/remove toast slide if present.
- **`:focus-visible`** for `.nav-link`, `.nav-role-tab`, `.view-btn`, `.mbn-item`, `.cc-book-btn`, `.mobile-nav-row` (outline + offset).

### A4. `tobc.html` — Booking modal trust

- Below booking breadcrumb or above summary: one line, e.g. _“MARINA-accredited providers · Secure checkout”_ with class `booking-trust-strip`; style in `tobc.css`.

### A5. Breadcrumbs (optional polish)

- Add `aria-current="page"` on each page’s breadcrumb `<span class="current">…</span>`.

### A6. After merge — update this doc

- Mark rows in §1–§6 as done where applicable; add dated line under **Implementation log** with files touched.
