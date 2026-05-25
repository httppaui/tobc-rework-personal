import { forceUnlockBodyScroll } from './scrollLock';

/** Remove all DOM side effects from the guided tour (call when tour ends). */
export function cleanupTourDom(): void {
  document.documentElement.classList.remove('tobc-tour-interactive', 'tobc-show-onboard');
  document.querySelectorAll('[data-tour-active]').forEach((el) => {
    el.removeAttribute('data-tour-active');
  });
  document.querySelectorAll('.tour-root').forEach((el) => {
    el.remove();
  });
  forceUnlockBodyScroll();
}
