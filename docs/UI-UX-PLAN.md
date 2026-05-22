# TOBC — UI/UX plan (living document)

This file is the **source of truth** for UI/UX direction for the TOBC site (**React + TypeScript + Tailwind** in `src/`, Vite entry `index.html`).

**Full project overview:** [PROJECT.md](./PROJECT.md) (requirements, stack, architecture, phases, doc-sync workflow).

**Auto-sync:** Cursor applies [`.cursor/rules/tobc-ui-ux-sync.mdc`](../.cursor/rules/tobc-ui-ux-sync.mdc) when those files are in context — the agent should update this doc (checklists + **Implementation log**) after material UI/UX edits. True filesystem watchers are not used; the rule drives habit in-agent.

---

## Current baseline

- **Design tokens**: `:root` in `assets/styles/main.css` — brand palette (Navy `#004762`, Deep Sea `#00555e`, Teal `#28a5a8`, Sky `#b9e5fb`, Orange `#FF7500`, Ochre `#fdba61`, Ivory `#fffce8`) mapped to semantic `--teal-*`, `--amber`, `--paper`.
- **Code layout**: `src/components/`, `src/pages/`, `src/context/`, `src/data/`, `public/assets/`; legacy `assets/styles/main.css` + `legacy-tobc.html` kept for reference.
- **Typography**: Montserrat (headings), DM Sans (body).
- **Chrome**: Sticky nav + global search bar + role tabs + dropdowns + mobile drawer + bottom nav — high density above the fold.
- **Pages** (SPA): home, courses, partners, about, news, library, help (`#/help`), messages, bookings, profile, settings. Entry: **`index.html`** (root).
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
| One primary CTA per major region | [x] | Home hero + bottom CTA: teal primary, secondary outline (Phase A) |
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
| Loading: skeleton or pulse during filter | [x] | Card shimmer on Courses & Partners filter/search (`ResultsSkeleton`) |
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

- **2026-05-22 — Book Now without sign-in:** `beginBooking` opens booking modal directly (no auth gate); guest/demo confirmation when API or auth unavailable. Files: `AppProvider.tsx`, `BookingModal.tsx`, `booking.ts`, `UI-UX-PLAN.md`.
- **2026-05-22 — Pause production sign-in:** `VITE_AUTH_ENABLED` flag; production hides Log in/Register until API ready; dev unchanged. Files: `featureFlags.ts`, `AppProvider.tsx`, `SiteHeader.tsx`, `MobileDrawer.tsx`, `Footer.tsx`, `WishlistPage.tsx`, `CartPage.tsx`, `BookedCoursesPage.tsx`, `DEPLOY.md`, `UI-UX-PLAN.md`.

- **2026-05-22 — Booked Courses page hero:** Teal shelf hero matches Cart/Wishlist (`ShelfPageHero`). Files: `BookedCoursesPage.tsx`, `UI-UX-PLAN.md`.

- **2026-05-22 — Business partner profile modal:** Business cards open tabbed modal (about, contact, address, cancellation, gallery) with View website; industry cards keep Visit Site. Files: `PartnerDetailModal.tsx`, `PartnerCard.tsx`, `partnerCatalog.ts`, `AppProvider.tsx`, `Layout.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-22 — Partners category deep links:** Mega menu, footer, and `?category=` URL always apply business-only or industry-only filters (toolbar + sidebar); shared `partnerRoutes.ts`. Files: `partnerRoutes.ts`, `PartnersPage.tsx`, `PartnersNavMenu.tsx`, `Footer.tsx`, `UI-UX-PLAN.md`.

- **2026-05-22 — Partners mega-menu tab hover:** Business / Industry sidebar tabs use solid white background on hover (matches active state). Files: `main.css`, `UI-UX-PLAN.md`.

- **2026-05-22 — Partners mega-menu category clicks:** Business / Industry sidebar tabs navigate to filtered Partners page on click (hover still previews submenu). Files: `PartnersNavMenu.tsx`, `UI-UX-PLAN.md`.

- **2026-05-22 — Skip payment for free bookings:** All-free carts skip step 4 and go to confirmation; progress shows “No payment”. Files: `booking.ts`, `BookingModal.tsx`, `main.css`.

- **2026-05-22 — Booking step 4 payment methods:** Bank / e-wallet / gateway selection with sample pay-to details and QR placeholder; proof upload below. Files: `BookingPaymentStep.tsx`, `paymentMethods.ts`, `BookingModal.tsx`, `types/index.ts`, `main.css`.

- **2026-05-22 — Collapsible booking summary:** Multi-course sidebar uses accordion per line item (title, hint, fee in header). Files: `BookingSummary.tsx`, `main.css`.

- **2026-05-22 — Multi-course checkout:** 5-step flow (review → details → per-course schedules → pay → confirm); cart/wishlist checkout all selected; batch booking API calls; cart clears on success. Files: `BookingModal.tsx`, `BookingSummary.tsx`, `booking.ts`, `bookingsApi.ts`, `AppProvider.tsx`, `types/index.ts`, `CartPage.tsx`, `WishlistPage.tsx`, `CartOrderSummary.tsx`, `main.css`.

- **2026-05-22 — Booking step 2:** Auto-fill first/last name and email from logged-in user; removed SRB field; all contact fields required (mobile + email). Files: `BookingModal.tsx`, `AppProvider.tsx`, `userName.ts`, `types/index.ts`, `main.css`, `server/routes/bookings.ts`.

- **2026-05-22 — Course detail modal tabs:** Course Overview, Training Outcomes, Entry Standards (requirements + PDF), Cancellation Policy (policy + PDF); teal underline tab bar. Files: `CourseDetailModal.tsx`, `courseCatalog.ts`, `courses.ts`, `main.css`, `public/assets/documents/*.pdf`.

- **2026-05-22 — Wishlist/cart require sign-in:** No guest localStorage lists or header badges when logged out; add actions open login; lists clear on logout; wishlist/cart pages show sign-in empty state. Files: `AppProvider.tsx`, `storage.ts`, `SiteHeader.tsx`, `WishlistPage.tsx`, `CartPage.tsx`, `helpCenter.ts`.

- **2026-05-11 — Handoff (blocked in Plan mode):** Plan mode could not edit non-markdown files; see below for completed Agent implementation.

- **2026-05-11 — Appendix A shipped (Agent):** Hash routing (`#/courses`, `#/partners/training`), `navigate(..., { fromHash })`, `initEscapeKey`, `syncDrawerNavHighlight`, mobile bottom nav (Home / Courses / Partners / More) + `data-mbn-page`, drawer `data-nav-page` + current-route styling, global search hint copy, booking trust strip, breadcrumb `aria-current`, `:focus-visible` + `prefers-reduced-motion`, `--space-*` tokens, silent grid/list toggle. Files: `tobc.js`, `tobc.html`, `tobc.css`, `UI-UX-PLAN.md`.

- **2026-05-11 — Bootstrap Icons (no emoji):** Replaced decorative emoji / unicode symbols with Bootstrap Icons (`<i class="bi …">`): nav actions, drawer, hero, steps, course/partner/news/library cards, ratings (star icons), filters/FAQ chevrons, view toggle, pagination, footer + social, help FAB, booking step check/close, course search icons in `.cs-input-wrap`; toasts + role hero CTAs in `tobc.js`. Supporting sizes in `tobc.css`. Files: `tobc.html`, `tobc.css`, `tobc.js`, `UI-UX-PLAN.md`.

- **2026-05-18 — Onboarding overlay reliability:** Show overlay via inline head script + `html.tobc-show-onboard` before deferred JS; init on `DOMContentLoaded` instead of `window.load`; safe `localStorage` helpers; body scroll lock; `?onboard=reset` clears flag for retesting. Files: `tobc.html`, `tobc.css`, `tobc.js`, `UI-UX-PLAN.md`.

- **2026-05-19 — About Us interactive puzzle:** Four interlocking puzzle pieces (PNG assets) with corner captions; click opens modal with full Platform / Mission / Story / Vision copy; backdrop blur + section dim; Escape to close. Files: `tobc.html`, `tobc.css`, `tobc.js`, `assets/about/*.png`, `UI-UX-PLAN.md`.

- **2026-05-19 — Puzzle alignment fix:** Single `puzzle-complete.png` with transparent hit-layer buttons (replaces four separate PNGs in grid) so pieces interlock like reference artwork. Files: `index.html`, `tobc.css`, `assets/about/puzzle-complete.png`.

- **2026-05-19 — Dark hero breadcrumbs:** Higher-contrast white breadcrumb text on Courses, Partners, News, Library, About, Messages heroes. Files: `main.css`.

- **2026-05-19 — Course card actions:** Ratings below provider; **View description** link; wishlist/cart icon buttons on `CourseCard`. Files: `CourseCard.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Phase C polish:** `docs/POLISH.md`; shared `EmptyResults` on Partners/News/Library; booking price strip + mobile header back; legal modals (cookie, disclaimer, refund, careers, contact); Display & accessibility panel (`AccessibilityModal`, `localStorage`). Files: `main.css`, `Footer.tsx`, `BookingModal.tsx`, `legalContent.ts`, `AppProvider.tsx`, `ProfileMenu.tsx`, `SettingsPage.tsx`, `POLISH.md`, `ROADMAP.md`.

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

- **2026-05-19 — Auth login/register polish:** Auth modal above onboarding (z-index); session restore gate; API health hint; show/hide password; book-flow register/login; server `.env` load. Files: `AuthModal.tsx`, `AppProvider.tsx`, `authApi.ts`, `server/env.ts`, `SiteHeader.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Auth API fix + terms checkbox:** Replaced `better-sqlite3` with Node built-in `node:sqlite` (Windows/Node 22); required Terms/Privacy checkbox before login/register. Files: `server/db.ts`, `AuthModal.tsx`, `package.json`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Register password UX:** Centered show/hide toggle inside input wrap; live requirements checklist (8+ chars, letter, number); client + server validation aligned. Files: `AuthModal.tsx`, `passwordRules.ts`, `server/routes/auth.ts`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Terms & Privacy modals:** Scrollable legal dialogs (Terms of Use, Privacy Policy) from auth checkbox links and footer Legal column; layered above auth modal. Files: `LegalModal.tsx`, `legalContent.ts`, `AppProvider.tsx`, `AuthModal.tsx`, `Footer.tsx`, `Layout.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Password rules popover:** Requirements appear in a floating panel on password focus while registering, not fixed below the field. Files: `AuthModal.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Toast position:** Toasts (e.g. account created) centered below the header for visibility. Files: `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Profile menu dropdown:** Logged-in header uses avatar + menu (Profile, Settings & privacy, Help center, Display & accessibility, Log out). Files: `ProfileMenu.tsx`, `SiteHeader.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Live chat page:** `/messages` inbox + chat UI (bubbles, quick replies, typing demo); header message icon and Help FAB link here. Files: `MessagesPage.tsx`, `chatSupport.ts`, `App.tsx`, `routes.ts`, `SiteHeader.tsx`, `HelpFab.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-19 — Scroll jump fix:** Chat scroll contained to message pane; modal scroll lock preserves position; removed global smooth scroll on focus/hash links. Files: `scrollLock.ts`, `AppProvider.tsx`, `MessagesPage.tsx`, `main.css`, `Footer.tsx`, `SiteHeader.tsx`, `CoursesPage.tsx`, `UI-UX-PLAN.md`.

- **2026-05-20 — Docs:** Moved `UI-UX-PLAN.md` to `docs/UI-UX-PLAN.md`; updated cross-links and Cursor sync rule. Files: `docs/UI-UX-PLAN.md`, `docs/PROJECT.md`, `docs/ROADMAP.md`, `docs/POLISH.md`, `.cursor/rules/tobc-ui-ux-sync.mdc`, `README.md`.

- **2026-05-20 — Dark section backgrounds:** `--teal-900` mapped to Deep Sea (`#00555e`) instead of Navy for hero, page heroes, footer, booking header, etc. Files: `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Booking stepper (compact teal):** Smaller circles/icons; teal bar + white elements; gap circle→icon; orange active step with pulsing outer ring (`prefers-reduced-motion` safe). Files: `BookingModal.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Phase A polish (POLISH.md):** Courses zero-results via `EmptyResults` (“Clear all filters”); `ResultsSkeleton` on Courses/Partners filter; removed noisy info toasts (role switch, search, Opening…); home hero/banner primary `btn-primary` + secondary `btn-secondary`. Files: `CoursesPage.tsx`, `PartnersPage.tsx`, `HomePage.tsx`, `SiteHeader.tsx`, `ResultsSkeleton.tsx`, `LibraryPage.tsx`, `Footer.tsx`, `AboutPage.tsx`, `assets/styles/main.css`, `POLISH.md`, `UI-UX-PLAN.md`.

- **2026-05-20 — Help Center page:** `/help` with “Need Help?” hero, topic search, six expandable category cards (accordion Q&A), shared landing FAQ (`FaqAccordion`), Contact Us grid; Help FAB + footer/profile link here; home FAQ uses same data component. Files: `HelpCenterPage.tsx`, `helpCenter.ts`, `FaqAccordion.tsx`, `HelpFab.tsx`, `Footer.tsx`, `ProfileMenu.tsx`, `HomePage.tsx`, `App.tsx`, `routes.ts`, `types/index.ts`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Help Center entry points:** Profile “Help & support” + “Help center” link, footer Help Center, home FAQ CTA button, mobile drawer Help Center all navigate to `#/help`. Files: `ProfileMenu.tsx`, `Footer.tsx`, `HomePage.tsx`, `MobileDrawer.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Orange CTA accents:** Primary buttons, section eyebrows, bottom CTA banner, help FAB/panel header, scroll-top accent, footer social hover use `--brand-orange`. Files: `assets/styles/main.css`, `HomePage.tsx`, `UI-UX-PLAN.md`.

- **2026-05-20 — Cart checkout layout:** Multi-select checkboxes, search, sticky booking-details summary with line items and total, Book now for selected courses. Files: `CartPage.tsx`, `CartOrderSummary.tsx`, `main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Header icon row:** Reordered nav actions to wishlist → cart → messages → notifications (bell); removed header search icon. Files: `SiteHeader.tsx`, `UI-UX-PLAN.md`.

- **2026-05-20 — Booked Courses page:** Profile menu item after Profile; `/booked-courses` lists account bookings with search; booking confirmation links here; `/bookings` redirects. Files: `BookedCoursesPage.tsx`, `BookingsPage.tsx`, `ProfileMenu.tsx`, `BookingModal.tsx`, `App.tsx`, `routes.ts`, `types`, `main.css`, `helpCenter.ts`, `MobileDrawer.tsx`, `UI-UX-PLAN.md`.

- **2026-05-20 — Booking confirmation + notifications:** Step 4 split into review (summary + Confirm booking) vs success; API submit on Confirm; centered success block; header bell opens persisted notification list (badge, mark read on open); confirmation adds in-app notification. Files: `BookingModal.tsx`, `SiteHeader.tsx`, `NotificationBell.tsx`, `AppProvider.tsx` (context), `storage.ts`, `types/index.ts`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Booking summary (confirm step):** Centered Booking Summary + intro on step 4 review; summary rows use grid so labels (e.g. Training Center) stay one column and values wrap right-aligned (fixes stray “Training/Center” split). Files: `BookingSummary.tsx`, `BookingModal.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Wishlist & cart selection:** Per-item checkboxes, select all, bulk Remove selected and Book now (wishlist toolbar; cart toolbar + existing order summary). Files: `WishlistPage.tsx`, `CartPage.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Cart booking details (multi):** Collapsible course rows in order summary — title only by default; tap to expand training center through course fee. Files: `CartOrderSummary.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Cart & Wishlist heroes:** Dark teal page hero (breadcrumb on dark, title, lede, status pill) matching Live chat; content in `shelf-page-body`. Files: `ShelfPageHero.tsx`, `CartPage.tsx`, `WishlistPage.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Live chat page polish:** Ivory page/body background; inbox + chat shell stay white; removed orange inset on active thread (teal-50 highlight). Files: `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Partners page background:** Main content area (filters + grid) uses white instead of ivory. Files: `PartnersPage.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Partners search toolbar:** Sticky bar matches Courses (search + partner type, sort, location dropdowns); removed type tab row and duplicate results search. Files: `PartnersPage.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Partners grid/list toggle:** View toggle in results header; list layout for partner cards; skeleton variant for list. Files: `PartnersPage.tsx`, `ResultsSkeleton.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Partners categories:** Business vs Industry partners; business sub-types (training, assessment, PDOS, review, schools, others); hero “Our Partners”; toolbar and sidebar category filters. Files: `partners.ts`, `partnerFilterOptions.ts`, `partnerFilters.ts`, `PartnersFilters.tsx`, `PartnersPage.tsx`, `UI-UX-PLAN.md`.

- **2026-05-20 — Course list badges:** Category/availability badges move to upper-right of white body in list view (not on teal strip). Files: `CourseCard.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Course list card density:** Title+badges, provider+rating, description+meta rows; tighter padding and sidebar width. Files: `CourseCard.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Partner list badges:** Category/type badges stacked above Visit Site in list view right column. Files: `PartnerCard.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Partner Visit Site button:** Toast on click; natural pill width in list view; Bootstrap icon. Files: `PartnerCard.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Course/partner badge size:** Slightly smaller pills on course cards, partner cards, and course detail modal. Files: `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Partners nav dropdown:** Two-level flyout (Business / Industry); business types and industry partner links; `?partner=` deep link. Files: `PartnersNavMenu.tsx`, `partnersNav.ts`, `SiteHeader.tsx`, `PartnersPage.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Footer Partners column:** Heading “Partners”; links for Business Partners and Industry Partners with category filters. Files: `Footer.tsx`, `UI-UX-PLAN.md`.

- **2026-05-20 — Log out confirmation:** Modal confirms sign-out from profile menu and mobile drawer. Files: `LogoutConfirmModal.tsx`, `AppProvider.tsx`, `ProfileMenu.tsx`, `MobileDrawer.tsx`, `Layout.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — UX polish (search scope, chrome density, partners mega-menu, booking primer):** Global search line “Searches courses only”; compact laptop chrome (shorter nav, tighter bars, horizontal role shortcuts); Partners dropdown two-column mega-menu with tap targets for categories; one-time “How booking works” modal before first book/login. Files: `SiteHeader.tsx`, `PartnersNavMenu.tsx`, `BookingFlowPrimerModal.tsx`, `AppProvider.tsx`, `storage.ts`, `Layout.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Remove role quick bar:** Dropped Seafarer/Agency/Center shortcut strip below global search; role tabs in nav unchanged. Files: `SiteHeader.tsx`, `assets/styles/main.css`, `UI-UX-PLAN.md`.

- **2026-05-20 — Pagination footer spacing:** Extra margin below course list pagination before footer. Files: `assets/styles/main.css`, `UI-UX-PLAN.md`.

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
