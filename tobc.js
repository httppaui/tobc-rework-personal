/* ── Router ── */
let currentPage = 'home';
let currentRole = 'seafarer';

const ROUTE_PAGES = new Set(['home', 'courses', 'partners', 'about', 'news', 'library']);

function parseRouteFromHash() {
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

function setRouteHash(page, filter) {
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

function initHashRouter() {
  window.addEventListener('hashchange', () => {
    const { page, filter } = parseRouteFromHash();
    navigate(page, filter, { fromHash: true });
  });
  const { page, filter } = parseRouteFromHash();
  if (page !== 'home' || filter) {
    navigate(page, filter, { fromHash: true });
  }
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

const ROLE_PATHS = {
  seafarer: {
    label: 'Seafarer',
    links: [
      ['Browse courses', () => navigate('courses')],
      ['My bookings', () => toast('Opening My Bookings…', 'info')],
      ['Certificates', () => toast('Opening Certificates…', 'info')],
      ['FAQ & help', () => goToFaq()],
    ],
  },
  agency: {
    label: 'Manning agency',
    links: [
      ['Book for crew', () => toast('Opening agency bulk booking…', 'info')],
      ['Compliance tracker', () => toast('Opening compliance dashboard…', 'info')],
      ['Partner centers', () => navigate('partners', 'training')],
      ['Invoices & billing', () => toast('Opening billing…', 'info')],
    ],
  },
  center: {
    label: 'Training center',
    links: [
      ['Provider dashboard', () => toast('Opening provider portal…', 'info')],
      ['List schedules', () => toast('Opening schedule manager…', 'success')],
      ['Payouts', () => toast('Opening payouts…', 'info')],
      ['Partner support', () => toast('Opening partner support…', 'info')],
    ],
  },
};

function renderRolePaths() {
  const nav = document.getElementById('navRolePaths');
  const lab = document.getElementById('roleQuickLabel');
  const cfg = ROLE_PATHS[currentRole] || ROLE_PATHS.seafarer;
  if (lab) lab.textContent = cfg.label;
  if (!nav) return;
  nav.innerHTML = cfg.links
    .map(
      ([text, fn], i) =>
        `<button type="button" class="role-ql" id="rolePath-${currentRole}-${i}">${text}</button>`
    )
    .join('');
  cfg.links.forEach(([, fn], i) => {
    const b = document.getElementById(`rolePath-${currentRole}-${i}`);
    if (b) b.addEventListener('click', (e) => { e.preventDefault(); fn(); });
  });
}

function withBtnLoading(btn, fn) {
  if (!btn || typeof fn !== 'function') {
    if (typeof fn === 'function') fn();
    return;
  }
  if (btn.classList.contains('is-loading')) return;
  btn.classList.add('is-loading');
  btn.setAttribute('aria-busy', 'true');
  const done = () => {
    btn.classList.remove('is-loading');
    btn.removeAttribute('aria-busy');
  };
  try {
    const r = fn();
    if (r && typeof r.then === 'function') r.finally(done);
    else setTimeout(done, 320);
  } catch (e) {
    done();
  }
}

function navigate(page, filter, opts = {}) {
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

function syncMobileNav(page) {
  document.querySelectorAll('.mbn-item').forEach((b) => b.classList.remove('active'));
  const match = document.querySelector(`.mbn-item[data-mbn-page="${page}"]`);
  if (match) match.classList.add('active');
}

function syncDrawerNavHighlight(page) {
  document.querySelectorAll('.mobile-nav-row[data-nav-page]').forEach((el) => {
    el.classList.toggle('is-current-route', el.dataset.navPage === page);
  });
}

function initEscapeKey() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const booking = document.getElementById('bookingOverlay');
    if (booking?.classList.contains('open')) {
      e.preventDefault();
      closeBooking();
      return;
    }
    const drawer = document.getElementById('drawer');
    if (drawer?.classList.contains('open')) {
      e.preventDefault();
      closeDrawer();
      return;
    }
    const help = document.getElementById('helpPanel');
    if (help?.classList.contains('open')) {
      e.preventDefault();
      help.classList.remove('open');
      return;
    }
    const onboard = document.getElementById('onboardOverlay');
    if (onboard?.classList.contains('open')) {
      e.preventDefault();
      hideOnboarding(onboard);
      markOnboardingComplete();
      return;
    }
    document.querySelectorAll('.nav-link-wrap.is-dropdown-open').forEach((w) => {
      w.classList.remove('is-dropdown-open');
    });
  });
}

/* ── Role switching ── */
function switchRole(role, btn) {
  currentRole = role in ROLE_PATHS ? role : 'seafarer';
  document.querySelectorAll('.nav-role-tab').forEach((t) => t.classList.remove('active'));
  const tabBtn = btn || document.querySelector(`.nav-role-tab[data-role="${currentRole}"]`);
  if (tabBtn) tabBtn.classList.add('active');
  const ctaMap = {
    seafarer: `<button type="button" class="btn btn-amber btn--lg" onclick="navigate('courses')"><i class="bi bi-search" aria-hidden="true"></i> Find a course &amp; schedule</button><button type="button" class="btn btn-ghost btn--lg" onclick="toast('Opening seafarer registration…','success')">Create free seafarer account</button>`,
    agency: `<button type="button" class="btn btn-amber btn--lg" onclick="toast('Opening agency portal…','info')"><i class="bi bi-people-fill" aria-hidden="true"></i> Bulk-book for my crew</button><button type="button" class="btn btn-ghost btn--lg" onclick="toast('Opening agency portal…','info')">Agency dashboard →</button>`,
    center: `<button type="button" class="btn btn-amber btn--lg" onclick="toast('Opening training center portal…','success')"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i> Publish courses on TOBC</button><button type="button" class="btn btn-ghost btn--lg" onclick="toast('Opening provider portal…','info')">Provider console →</button>`,
  };
  const valueProp = document.getElementById('heroValueProp');
  const props = {
    seafarer: 'The Philippines’ trusted marketplace for MARINA-accredited STCW and maritime courses — search real schedules, live seats, and verified centers in one place.',
    agency: 'One workspace to book crew training, track STCW compliance, and invoice in bulk — tied to MARINA-accredited centers you already trust.',
    center: 'Fill classes faster: list accredited schedules, sync seat counts, and get paid online — with visibility to 12,400+ active seafarers.',
  };
  if (valueProp) valueProp.textContent = props[role] || props.seafarer;
  const el = document.getElementById('heroCTAs');
  if (el) el.innerHTML = ctaMap[role] || ctaMap.seafarer;
  renderRolePaths();
  toast(`Viewing: ${ROLE_PATHS[currentRole].label}`, 'success');
}

/* ── Global & home search ── */
function runGlobalSearch() {
  const qEl = document.getElementById('globalSearchQ');
  const q = (qEl && qEl.value.trim()) || '';
  const btn = document.getElementById('globalSearchBtn');
  withBtnLoading(btn, () => {
    navigate('courses');
    setTimeout(() => {
      const cq = document.getElementById('courseSearchQ');
      if (cq) cq.value = q;
      filterCourseCards();
      toast(q ? `Searching courses for “${q}”` : 'Showing all courses', 'info');
    }, 200);
  });
}

function runHomeSearch() {
  const h = document.getElementById('homeSearchQ');
  const g = document.getElementById('globalSearchQ');
  const q = (h && h.value.trim()) || '';
  if (g) g.value = q;
  const btn = document.getElementById('homeSearchBtn');
  withBtnLoading(btn, () => runGlobalSearch());
}

/* ── Stats counter ── */
function animateNum(el, target, suffix = '', dur = 1800) {
  let v = 0;
  const step = target / (dur / 16);
  const run = () => {
    v = Math.min(v + step, target);
    el.textContent = (target > 100 ? Math.floor(v).toLocaleString() : Math.floor(v)) + suffix;
    if (v < target) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateNum(document.getElementById('s1'), 12400, '+');
        animateNum(document.getElementById('s2'), 84, '');
        animateNum(document.getElementById('s3'), 320, '+');
        animateNum(document.getElementById('s4'), 98, '%');
        obs.disconnect();
      }
    });
  },
  { threshold: 0.3 }
);
setTimeout(() => {
  const sb = document.querySelector('.stats-bar');
  if (sb) obs.observe(sb);
}, 100);

/* ── Course filter (debounced + panel feedback) ── */
let filterTimer;
function filterCourseCards() {
  clearTimeout(filterTimer);
  const panel = document.getElementById('coursesResultsPanel');
  if (panel) panel.classList.add('is-filtering');
  filterTimer = setTimeout(() => {
    const q = (document.getElementById('courseSearchQ')?.value || '').toLowerCase();
    const cat = (document.getElementById('csCat')?.value || '').toLowerCase();
    const loc = (document.getElementById('csLoc')?.value || '').toLowerCase();
    const cards = document.querySelectorAll('#coursesGrid .course-card');
    let visible = 0;
    cards.forEach((c) => {
      const title = (c.dataset.title || '').toLowerCase();
      const ccat = (c.dataset.cat || '').toLowerCase();
      const cloc = (c.dataset.loc || '').toLowerCase();
      const matchQ = !q || title.includes(q);
      const matchCat = !cat || ccat.includes(cat);
      const matchLoc = !loc || cloc.includes(loc);
      const show = matchQ && matchCat && matchLoc;
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const rc = document.getElementById('resultCount');
    if (rc) rc.textContent = visible;
    const nr = document.getElementById('noResults');
    if (nr) nr.style.display = visible === 0 ? 'block' : 'none';
    if (panel) panel.classList.remove('is-filtering');
  }, 220);
}

function clearFilters() {
  ['courseSearchQ', 'csCat', 'csLoc'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('#page-courses input[type="checkbox"]').forEach((cb) => (cb.checked = false));
  document.querySelectorAll('#page-courses input[type="radio"]').forEach((r) => {
    r.checked = false;
  });
  filterCourseCards();
  toast('All filters cleared', 'info');
}

function setView(mode) {
  const grid = document.getElementById('coursesGrid');
  const gb = document.getElementById('gridViewBtn');
  const lb = document.getElementById('listViewBtn');
  if (!grid) return;
  if (mode === 'list') {
    grid.className = 'courses-list-view';
    grid.querySelectorAll('.course-card').forEach((c) => {
      c.classList.add('list-mode');
    });
    gb.classList.remove('active');
    lb.classList.add('active');
  } else {
    grid.className = 'courses-grid-view';
    grid.querySelectorAll('.course-card').forEach((c) => c.classList.remove('list-mode'));
    lb.classList.remove('active');
    gb.classList.add('active');
  }
}

function toggleFilter(header) {
  header.closest('.filter-group').classList.toggle('open');
}

/* ── Partner filter ── */
function filterPartners(type, btn) {
  document.querySelectorAll('.partner-type-tab').forEach((t) => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#partnersGrid .partner-card').forEach((c) => {
    c.style.display = type === 'all' || c.dataset.type === type ? '' : 'none';
  });
}

/* ── News filter ── */
function filterNews(cat, btn) {
  document.querySelectorAll('.news-cat-tab').forEach((t) => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#newsGrid .news-full-card').forEach((c) => {
    c.style.display = cat === 'all' || c.dataset.cat === cat ? '' : 'none';
  });
}

/* ── Library filter ── */
function filterLib(type, btn) {
  const page = document.getElementById('page-library');
  if (page) page.querySelectorAll('.partner-type-tab').forEach((t) => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#libraryGrid .lib-card').forEach((c) => {
    c.style.display = type === 'all' || c.dataset.type === type ? '' : 'none';
  });
}

/* ── FAQ ── */
function toggleFaq(item) {
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

function goToFaq() {
  navigate('home');
  setTimeout(() => {
    const faq = document.getElementById('faq-section');
    if (faq) faq.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 350);
}

/* ── Booking Modal ── */
function openBooking(title, price, center, loc, date, dur, cat) {
  document.getElementById('bModalTitle').textContent = 'Booking: ' + title;
  document.getElementById('bSumTitle').textContent = title;
  document.getElementById('bSumCenter').textContent = center;
  document.getElementById('bSumLoc').textContent = loc;
  document.getElementById('bSumDate').textContent = date;
  document.getElementById('bSumDur').textContent = dur;
  document.getElementById('bSumCat').textContent = cat;
  document.getElementById('bSumPrice').textContent = price;
  const bc = document.getElementById('bcStepLabel');
  if (bc) bc.textContent = `Your details · ${date} · ${loc} (step 2 of 4)`;
  document.getElementById('bookingOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeBooking() {
  document.getElementById('bookingOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeBookingBg(e) {
  if (e.target === document.getElementById('bookingOverlay')) closeBooking();
}

/* ── Help FAB ── */
function toggleHelp() {
  document.getElementById('helpPanel').classList.toggle('open');
}

/* ── Mobile Drawer ── */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
}
function closeDrawerBg(e) {
  if (e.target === document.getElementById('drawer')) closeDrawer();
}

/* ── Toast ── */
let tc = 0;
function toast(msg, type = 'info') {
  const icons = {
    success: '<i class="bi bi-check-circle-fill" aria-hidden="true"></i>',
    info: '<i class="bi bi-info-circle-fill" aria-hidden="true"></i>',
    warning: '<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>',
    error: '<i class="bi bi-x-circle-fill" aria-hidden="true"></i>',
  };
  const id = 't' + ++tc;
  const div = document.createElement('div');
  div.className = `toast ${type === 'info' ? '' : type}`;
  div.id = id;
  div.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${msg}</span><button type="button" class="toast-close" onclick="rmToast('${id}')" aria-label="Dismiss"><i class="bi bi-x-lg" aria-hidden="true"></i></button>`;
  document.getElementById('toastContainer').appendChild(div);
  setTimeout(() => rmToast(id), 3800);
}
function rmToast(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(120%)';
    setTimeout(() => el.remove(), 300);
  }
}

/* ── Course cards: session line from openBooking args ── */
function enhanceCourseCardDates() {
  const re =
    /openBooking\(\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*\)/;
  document.querySelectorAll('.course-card[onclick]').forEach((card) => {
    const oc = card.getAttribute('onclick');
    const m = oc && oc.match(re);
    if (!m) return;
    const date = m[5].replace(/\\'/g, "'");
    const dur = m[6].replace(/\\'/g, "'");
    let row = card.querySelector('.cc-date-range');
    if (!row) {
      row = document.createElement('div');
      row.className = 'cc-date-range';
      const meta = card.querySelector('.cc-meta');
      if (meta) meta.insertAdjacentElement('afterend', row);
    }
    row.textContent = `Session: ${date} · ${dur}`;
  });
}

/* ── Onboarding ── */
const ONBOARD_KEY = 'tobc_onboarded_v1';

function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(ONBOARD_KEY) === '1';
  } catch {
    return false;
  }
}

function markOnboardingComplete() {
  try {
    localStorage.setItem(ONBOARD_KEY, '1');
  } catch {
    /* storage blocked */
  }
}

function clearOnboardingFlag() {
  try {
    localStorage.removeItem(ONBOARD_KEY);
  } catch {
    /* storage blocked */
  }
}

function showOnboarding(overlay) {
  overlay.classList.add('open');
  document.documentElement.classList.add('tobc-show-onboard');
  document.body.style.overflow = 'hidden';
}

function hideOnboarding(overlay) {
  overlay.classList.remove('open');
  document.documentElement.classList.remove('tobc-show-onboard');
  document.body.style.overflow = '';
}

function initOnboarding() {
  const overlay = document.getElementById('onboardOverlay');
  if (!overlay) return;

  const params = new URLSearchParams(location.search);
  if (params.get('onboard') === 'reset') {
    clearOnboardingFlag();
    params.delete('onboard');
    const qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + location.hash);
  }

  const dismiss = () => {
    hideOnboarding(overlay);
    markOnboardingComplete();
  };
  document.getElementById('onboardDismiss')?.addEventListener('click', dismiss);
  document.getElementById('onboardSkip')?.addEventListener('click', dismiss);

  if (hasCompletedOnboarding()) {
    hideOnboarding(overlay);
    return;
  }

  showOnboarding(overlay);
}

function initNavDropdowns() {
  const bar = document.querySelector('.nav-links');
  const wraps = bar ? bar.querySelectorAll('.nav-link-wrap') : [];
  if (!wraps.length) return;

  const setOnlyOpen = (openWrap) => {
    wraps.forEach((w) => {
      w.classList.toggle('is-dropdown-open', w === openWrap);
    });
  };

  wraps.forEach((wrap) => {
    wrap.addEventListener('mouseenter', () => setOnlyOpen(wrap));

    wrap.addEventListener('mouseleave', (e) => {
      const next = e.relatedTarget;
      if (!next || !wrap.contains(next)) {
        wrap.classList.remove('is-dropdown-open');
      }
    });

    wrap.addEventListener('focusin', () => setOnlyOpen(wrap));

    wrap.addEventListener('focusout', () => {
      queueMicrotask(() => {
        if (!wrap.contains(document.activeElement)) {
          wrap.classList.remove('is-dropdown-open');
        }
      });
    });
  });
}

function initNavLogo() {
  const logo = document.getElementById('navLogoHome');
  if (!logo) return;
  logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('home');
    }
  });
}

/* ── Init ── */
function boot() {
  initHashRouter();
  initEscapeKey();
  renderRolePaths();
  enhanceCourseCardDates();
  initNavDropdowns();
  initNavLogo();
  initOnboarding();
  if (hasCompletedOnboarding()) {
    setTimeout(() => toast('Tip: use the search bar at the top to jump straight to courses.', 'info'), 900);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
