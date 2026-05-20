/** DOM helpers — button loading states, etc. */

export function withBtnLoading(btn, fn) {
  if (!btn || typeof fn !== 'function') {
    if (typeof fn === 'function') fn();
    return;
  }
  if (btn.classList.contains('is-loading')) return;
  btn.classList.add('is-loading');
  btn.setAttribute('aria-busy', 'true');
  const done = () => {
    btn.classList.remove('is-loading');
    btn.removeAttribute('aria-busy');
  };
  try {
    const r = fn();
    if (r && typeof r.then === 'function') r.finally(done);
    else setTimeout(done, 320);
  } catch {
    done();
  }
}
