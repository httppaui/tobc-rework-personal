/** SPA hash routing and page navigation */

import { filterCourseCards } from './course-filter.js';

export const ROUTE_PAGES = new Set(['home', 'courses', 'partners', 'about', 'news', 'library']);

export let currentPage = 'home';

export function parseRouteFromHash() {
  const raw = (location.hash || '').replace(/^#/, '').replace(/^\//, '');
  if (!raw) return { page: 'home', filter: undefined };
  const segments = raw.split('/').map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
  const page = segments[0];
  const filter = segments[1] || undefined;
  if (!ROUTE_PAGES.has(page)) return { page: 'home', filter: undefined };
  return { page, filter };
}

export function setRouteHash(page, filter) {
  let next = '';
  if (page === 'home' && !filter) next = '';
  else if (filter) next = `#/${page}/${encodeURIComponent(filter)}`;
  else next = `#/${page}`;
  const cur = location.hash || '';
  if (cur === next || (!cur && !next)) return;
  if (next === '') {
    history.replaceState(null, '', location.pathname + location.search);
    return;
  }
  location.hash = next;
}

function clickFilterButtonByOnclick(fnName, filter) {
  const els = document.querySelectorAll(`[onclick*="${fnName}"]`);
  const re = new RegExp(`${fnName}\\('([^']*)'`);
  for (let i = 0; i < els.length; i++) {
    const oc = els[i].getAttribute('onclick') || '';
    const m = oc.match(re);
    if (m && m[1] === filter) {
      els[i].click();
      return;
    }
  }
}

export function syncMobileNav(page) {
  document.querySelectorAll('.mbn-item').forEach((b) => b.classList.remove('active'));
  const match = document.querySelector(`.mbn-item[data-mbn-page="${page}"]`);
  if (match) match.classList.add('active');
}

export function syncDrawerNavHighlight(page) {
  document.querySelectorAll('.mobile-nav-row[data-nav-page]').forEach((el) => {
    el.classList.toggle('is-current-route', el.dataset.navPage === page);
  });
}

export function navigate(page, filter, opts = {}) {
  if (!ROUTE_PAGES.has(page)) page = 'home';
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active-page'));
  const navLink = document.getElementById('nav-' + page);
  if (navLink) navLink.classList.add('active-page');
  currentPage = page;
  window.scrollTo({ top: 0, behavior: opts.fromHash ? 'auto' : 'smooth' });
  syncMobileNav(page);
  syncDrawerNavHighlight(page);
  if (!opts.fromHash) setRouteHash(page, filter);
  if (filter) {
    setTimeout(() => {
      if (page === 'courses') {
        const cs = document.getElementById('csCat');
        if (cs) cs.value = filter;
        filterCourseCards();
      }
      if (page === 'partners') clickFilterButtonByOnclick('filterPartners', filter);
      if (page === 'news') clickFilterButtonByOnclick('filterNews', filter);
    }, 100);
  }
}

export function initHashRouter() {
  window.addEventListener('hashchange', () => {
    const { page, filter } = parseRouteFromHash();
    navigate(page, filter, { fromHash: true });
  });
  const { page, filter } = parseRouteFromHash();
  if (page !== 'home' || filter) {
    navigate(page, filter, { fromHash: true });
  }
}
