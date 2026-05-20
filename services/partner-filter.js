/** Partner grid filtering */

export function filterPartners(type, btn) {
  document.querySelectorAll('.partner-type-tab').forEach((t) => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#partnersGrid .partner-card').forEach((c) => {
    c.style.display = type === 'all' || c.dataset.type === type ? '' : 'none';
  });
}
