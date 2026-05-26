import { useEffect } from 'react';

function animateNum(el: HTMLElement, target: number, suffix = '') {
  let v = 0;
  const step = target / (1800 / 16);
  const run = () => {
    v = Math.min(v + step, target);
    el.textContent = (target > 100 ? Math.floor(v).toLocaleString() : Math.floor(v)) + suffix;
    if (v < target) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

export function useStatsCounter() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const s1 = document.getElementById('s1');
          const s2 = document.getElementById('s2');
          const s3 = document.getElementById('s3');
          const s4 = document.getElementById('s4');

          if (s1) animateNum(s1, 12400);
          if (s2) animateNum(s2, 84);
          if (s3) animateNum(s3, 320);
          if (s4) animateNum(s4, 98, '%');

          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    const el = document.getElementById('stats-bar');
    if (el) obs.observe(el);

    return () => obs.disconnect();
  }, []);
}

