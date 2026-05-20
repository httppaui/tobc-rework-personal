/** Global and home search → courses */

import { withBtnLoading } from '../utils/dom.js';
import { navigate } from './router.js';
import { filterCourseCards } from './course-filter.js';
import { toast } from '../components/toast.js';

export function runGlobalSearch() {
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

export function runHomeSearch() {
  const h = document.getElementById('homeSearchQ');
  const g = document.getElementById('globalSearchQ');
  const q = (h && h.value.trim()) || '';
  if (g) g.value = q;
  const btn = document.getElementById('homeSearchBtn');
  withBtnLoading(btn, () => runGlobalSearch());
}
