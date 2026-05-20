/** News grid filtering */

export function filterNews(cat, btn) {
  document.querySelectorAll('.news-cat-tab').forEach((t) => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#newsGrid .news-full-card').forEach((c) => {
    c.style.display = cat === 'all' || c.dataset.cat === cat ? '' : 'none';
  });
}
