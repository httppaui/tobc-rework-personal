/** Mobile navigation drawer */

export function openDrawer() {
  document.getElementById('drawer')?.classList.add('open');
}

export function closeDrawer() {
  document.getElementById('drawer')?.classList.remove('open');
}

export function closeDrawerBg(e) {
  if (e.target === document.getElementById('drawer')) closeDrawer();
}
