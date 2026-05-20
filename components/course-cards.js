/** Enhance course cards with session metadata */

export function enhanceCourseCardDates() {
  const re =
    /openBooking\(\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*\)/;
  document.querySelectorAll('.course-card[onclick]').forEach((card) => {
    const oc = card.getAttribute('onclick');
    const m = oc && oc.match(re);
    if (!m) return;
    const date = m[5].replace(/\\'/g, "'");
    const dur = m[6].replace(/\\'/g, "'");
    let row = card.querySelector('.cc-date-range');
    if (!row) {
      row = document.createElement('div');
      row.className = 'cc-date-range';
      const meta = card.querySelector('.cc-meta');
      if (meta) meta.insertAdjacentElement('afterend', row);
    }
    row.textContent = `Session: ${date} · ${dur}`;
  });
}
