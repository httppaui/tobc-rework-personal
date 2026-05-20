/** Course listing filters and view mode */

import { toast } from '../components/toast.js';

let filterTimer;

export function filterCourseCards() {
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

export function clearFilters() {
  ['courseSearchQ', 'csCat', 'csLoc'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('#page-courses input[type="checkbox"]').forEach((cb) => {
    cb.checked = false;
  });
  document.querySelectorAll('#page-courses input[type="radio"]').forEach((r) => {
    r.checked = false;
  });
  filterCourseCards();
  toast('All filters cleared', 'info');
}

export function setView(mode) {
  const grid = document.getElementById('coursesGrid');
  const gb = document.getElementById('gridViewBtn');
  const lb = document.getElementById('listViewBtn');
  if (!grid) return;
  if (mode === 'list') {
    grid.className = 'courses-list-view';
    grid.querySelectorAll('.course-card').forEach((c) => c.classList.add('list-mode'));
    gb?.classList.remove('active');
    lb?.classList.add('active');
  } else {
    grid.className = 'courses-grid-view';
    grid.querySelectorAll('.course-card').forEach((c) => c.classList.remove('list-mode'));
    lb?.classList.remove('active');
    gb?.classList.add('active');
  }
}

export function toggleFilter(header) {
  header.closest('.filter-group')?.classList.toggle('open');
}
