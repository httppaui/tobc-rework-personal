/**
 * TOBC MVP — application entry
 * Wires ES modules and exposes handlers for inline HTML onclick attributes.
 */

import { initHashRouter, navigate } from '../services/router.js';
import { switchRole, renderRolePaths } from '../services/role-service.js';
import { runGlobalSearch, runHomeSearch } from '../services/search-service.js';
import {
  filterCourseCards,
  clearFilters,
  setView,
  toggleFilter,
} from '../services/course-filter.js';
import { filterPartners } from '../services/partner-filter.js';
import { filterNews } from '../services/news-filter.js';
import { filterLib } from '../services/library-filter.js';
import { toast, rmToast } from '../components/toast.js';
import { openBooking, closeBooking, closeBookingBg } from '../components/booking-modal.js';
import { initAboutPuzzle } from '../components/about-puzzle.js';
import { initOnboarding, hasCompletedOnboarding } from '../components/onboarding.js';
import { openDrawer, closeDrawer, closeDrawerBg } from '../components/drawer.js';
import { toggleHelp } from '../components/help-panel.js';
import { toggleFaq, goToFaq } from '../components/faq.js';
import { initNavDropdowns, initNavLogo } from '../components/nav.js';
import { enhanceCourseCardDates } from '../components/course-cards.js';
import { initEscapeKey } from '../components/escape-key.js';
import { initStatsCounter } from '../utils/animation.js';

/** Inline onclick handlers (legacy HTML) */
const globalHandlers = {
  navigate,
  switchRole,
  runGlobalSearch,
  runHomeSearch,
  filterCourseCards,
  clearFilters,
  setView,
  toggleFilter,
  filterPartners,
  filterNews,
  filterLib,
  toast,
  rmToast,
  openBooking,
  closeBooking,
  closeBookingBg,
  openDrawer,
  closeDrawer,
  closeDrawerBg,
  toggleHelp,
  toggleFaq,
  goToFaq,
};

Object.assign(window, globalHandlers);

async function boot() {
  initHashRouter();
  initEscapeKey();
  renderRolePaths();
  enhanceCourseCardDates();
  initNavDropdowns();
  initNavLogo();
  initOnboarding();
  initStatsCounter();
  await initAboutPuzzle();

  if (hasCompletedOnboarding()) {
    setTimeout(
      () => toast('Tip: use the search bar at the top to jump straight to courses.', 'info'),
      900
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    boot().catch((err) => console.error('TOBC boot failed', err));
  });
} else {
  boot().catch((err) => console.error('TOBC boot failed', err));
}
