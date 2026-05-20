# TOBC — Site polish plan

Polish work you can do **before deploy** (localhost with `npm run dev`). Check items off here and mirror key UX wins in [UI-UX-PLAN.md](../UI-UX-PLAN.md).

**Related:** [ROADMAP.md](./ROADMAP.md) (features & deploy) · [DEPLOY.md](./DEPLOY.md)

---

## Phase A — High impact (1–2 days)

| # | Task | Status |
|---|------|--------|
| A1 | **Courses empty state** — zero results message + “Clear all filters” | ☐ |
| A2 | **Loading skeletons** — Courses & Partners filter/search (card shimmer) | ☐ |
| A3 | **Toast noise** — remove info toasts for role switch, every search, “Opening…” | ☐ |
| A4 | **Home hero CTAs** — one primary teal action; others secondary | ☐ |

---

## Phase B — Mobile & tablet (~1 day)

| # | Task | Status |
|---|------|--------|
| B1 | **Touch targets** — filters, pagination, MBN ~44px min height | ☐ |
| B2 | **Tablet filters** — collapsible sidebar or filter drawer ~1024px | ☐ |
| B3 | **Mobile drawer CSS** — move inline styles → `main.css` | ☐ |

---

## Phase C — Consistency & trust (~1–2 days)

| # | Task | Status |
|---|------|--------|
| C1 | **Partners / News / Library** — shared empty-state pattern with Courses | [x] |
| C2 | **Booking modal** — price visible early; mobile back in header | [x] |
| C3 | **Footer legal** — Cookie, Disclaimer, Refund modals (like Terms/Privacy) | [x] |
| C4 | **Display & accessibility** — panel: text size + reduced motion (`localStorage`) | [x] |

---

## Phase D — Nice extras

| # | Task | Status |
|---|------|--------|
| D1 | Messages icon unread badge | ☐ |
| D2 | My Certificates placeholder page | ☐ |
| D3 | Agency / Training Center “Coming soon” pages | ☐ |
| D4 | Global vs Courses search — one line of explanatory copy | ☐ |

---

## Suggested week plan

| Day | Focus |
|-----|--------|
| 1 | Phase A1–A2 (empty states + skeletons) |
| 2 | Phase A3–A4 (toasts + hero) |
| 3 | Phase B (mobile/tablet) |
| 4 | Phase C (consistency) — **done in repo** |
| 5 | Phase D + full-device pass |

---

## Polish workflow

1. Pick one page (start with **Courses**).
2. Test at **375px**, **768px**, **1280px**.
3. Run core flows: browse → filter → book → account.
4. Fix only what confuses or looks broken.
5. Update this file + **Implementation log** in UI-UX-PLAN.md.

---

## Implementation log

| Date | Summary |
|------|---------|
| 2026-05-19 | Phase C: empty states (News/Library), booking price strip + mobile back, legal modals (cookie/disclaimer/refund), accessibility panel |
