/** Scroll so a tour target sits below sticky header + global search bar. */
export function scrollTourTargetIntoView(el: HTMLElement): void {
  const navH =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
  const searchBar = document.getElementById('globalSearchBar');
  const searchH = searchBar?.getBoundingClientRect().height ?? 0;
  const offset = navH + searchH + 16;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
}
