/** Role tabs — seafarer, agency, training center */

import { toast } from '../components/toast.js';
import { navigate } from './router.js';
import { goToFaq } from '../components/faq.js';

export let currentRole = 'seafarer';

export const ROLE_PATHS = {
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

export function renderRolePaths() {
  const nav = document.getElementById('navRolePaths');
  const lab = document.getElementById('roleQuickLabel');
  const cfg = ROLE_PATHS[currentRole] || ROLE_PATHS.seafarer;
  if (lab) lab.textContent = cfg.label;
  if (!nav) return;
  nav.innerHTML = cfg.links
    .map(
      ([text], i) =>
        `<button type="button" class="role-ql" id="rolePath-${currentRole}-${i}">${text}</button>`
    )
    .join('');
  cfg.links.forEach(([, fn], i) => {
    const b = document.getElementById(`rolePath-${currentRole}-${i}`);
    if (b) b.addEventListener('click', (e) => { e.preventDefault(); fn(); });
  });
}

export function switchRole(role, btn) {
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
