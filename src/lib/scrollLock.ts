let locked = false;
let savedScrollY = 0;

function parseBodyScrollTop(): number {
  const top = document.body.style.top;
  if (!top) return window.scrollY;
  const n = parseInt(top, 10);
  return Number.isFinite(n) ? Math.abs(n) : window.scrollY;
}

/** Lock window scroll without losing position (avoids overflow:hidden jump). */
export function lockBodyScroll(): void {
  if (locked) return;
  locked = true;
  savedScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}

/** Restore scroll position after lockBodyScroll(). */
export function unlockBodyScroll(): void {
  const scrollY = locked ? savedScrollY : parseBodyScrollTop();
  locked = false;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, scrollY);
}

/** Always clear scroll lock — use when tour/onboarding ends (guards stuck body styles). */
export function forceUnlockBodyScroll(): void {
  unlockBodyScroll();
}
