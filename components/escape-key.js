/** Global Escape key — close overlays in priority order */

import { closeAboutModal } from './about-puzzle.js';
import { closeBooking } from './booking-modal.js';
import { closeDrawer } from './drawer.js';
import { hideOnboarding, markOnboardingComplete } from './onboarding.js';

export function initEscapeKey() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    const aboutModal = document.getElementById('aboutModalOverlay');
    if (aboutModal?.classList.contains('open')) {
      e.preventDefault();
      closeAboutModal();
      return;
    }

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
