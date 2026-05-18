# TOBC — UI/UX plan (living document)

This file is the **source of truth** for UI/UX direction for the static TOBC site (`tobc.html`, `tobc.css`, `tobc.js`).

**Auto-sync:** Cursor applies [`.cursor/rules/tobc-ui-ux-sync.mdc`](.cursor/rules/tobc-ui-ux-sync.mdc) when those files are in context — the agent should update this doc (checklists + **Implementation log**) after material UI/UX edits. True filesystem watchers are not used; the rule drives habit in-agent.

---

## Current baseline

- **Design tokens**: `:root` in `tobc.css` (teal scale, neutrals, shadows, radius).
- **Typography**: Montserrat (headings), DM Sans (body).
- **Chrome**: Sticky nav + global search bar + role quick bar + dropdowns + mobile drawer + bottom nav — high density above the fold.
- **Pages** (SPA): `page-home`, `page-courses`, `page-partners`, `page-about`, `page-news`, `page-library`.
- **Debt**: Many inline `style=""` blocks in `tobc.html` — migrate to classes over time.

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
