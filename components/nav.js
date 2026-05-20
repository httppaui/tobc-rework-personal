/** Navbar dropdowns and logo keyboard support */

import { navigate } from '../services/router.js';

export function initNavDropdowns() {
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
      if (!next || !wrap.contains(next)) wrap.classList.remove('is-dropdown-open');
    });
    wrap.addEventListener('focusin', () => setOnlyOpen(wrap));
    wrap.addEventListener('focusout', () => {
      queueMicrotask(() => {
        if (!wrap.contains(document.activeElement)) wrap.classList.remove('is-dropdown-open');
      });
    });
  });
}

export function initNavLogo() {
  const logo = document.getElementById('navLogoHome');
  if (!logo) return;
  logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('home');
    }
  });
}
