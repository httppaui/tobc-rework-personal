/** Library grid filtering */

export function filterLib(type, btn) {
  const page = document.getElementById('page-library');
  page?.querySelectorAll('.partner-type-tab').forEach((t) => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#libraryGrid .lib-card').forEach((c) => {
    c.style.display = type === 'all' || c.dataset.type === type ? '' : 'none';
  });
}
