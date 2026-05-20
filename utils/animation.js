/** Scroll-triggered animations */

export function animateNum(el, target, suffix = '', dur = 1800) {
  if (!el) return;
  let v = 0;
  const step = target / (dur / 16);
  const run = () => {
    v = Math.min(v + step, target);
    el.textContent = (target > 100 ? Math.floor(v).toLocaleString() : Math.floor(v)) + suffix;
    if (v < target) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

export function initStatsCounter() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateNum(document.getElementById('s1'), 12400, '+');
          animateNum(document.getElementById('s2'), 84, '');
          animateNum(document.getElementById('s3'), 320, '+');
          animateNum(document.getElementById('s4'), 98, '%');
          obs.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  setTimeout(() => {
    const sb = document.querySelector('.stats-bar');
    if (sb) obs.observe(sb);
  }, 100);
}
