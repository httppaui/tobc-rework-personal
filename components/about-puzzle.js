/** About page — interlocking puzzle + detail modal */

import { loadAboutContent, getAboutContent } from '../services/about-content.js';

let aboutModalLastFocus = null;

export function openAboutModal(key) {
  const data = getAboutContent(key);
  const overlay = document.getElementById('aboutModalOverlay');
  if (!data || !overlay) return;

  aboutModalLastFocus = document.activeElement;
  const titleEl = document.getElementById('aboutModalTitle');
  titleEl.textContent = data.title;
  titleEl.style.color = data.accent;
  document.getElementById('aboutModalBody').innerHTML = data.body;
  document.getElementById('aboutModalAccent').style.background = data.accent;

  document.querySelectorAll('.about-puzzle-piece').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.aboutKey === key);
  });
  document.getElementById('aboutPuzzleSection')?.classList.add('is-dimmed');
  document.body.classList.add('about-modal-open');

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.getElementById('aboutModalClose')?.focus();
}

export function closeAboutModal() {
  const overlay = document.getElementById('aboutModalOverlay');
  if (!overlay?.classList.contains('open')) return;

  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.getElementById('aboutPuzzleSection')?.classList.remove('is-dimmed');
  document.body.classList.remove('about-modal-open');
  document.querySelectorAll('.about-puzzle-piece.is-active').forEach((btn) => btn.classList.remove('is-active'));

  if (aboutModalLastFocus && typeof aboutModalLastFocus.focus === 'function') {
    aboutModalLastFocus.focus();
  }
  aboutModalLastFocus = null;
}

function applyAboutPuzzleTheme() {
  const layout = document.querySelector('.about-puzzle-layout');
  if (!layout) return;

  document.querySelectorAll('[data-about-side]').forEach((block) => {
    const key = block.dataset.aboutSide;
    const data = getAboutContent(key);
    if (!data?.accent) return;

    layout.style.setProperty(`--about-${key}`, data.accent);
    const label = block.querySelector('.about-puzzle-side-label');
    if (label) label.style.color = data.accent;
  });
}

function renderAboutSideSummaries() {
  document.querySelectorAll('[data-about-side]').forEach((block) => {
    const key = block.dataset.aboutSide;
    const data = getAboutContent(key);
    const summaryEl = block.querySelector('.about-puzzle-side-summary');
    if (data?.summary && summaryEl) summaryEl.textContent = data.summary;
  });
  applyAboutPuzzleTheme();
}

export async function initAboutPuzzle() {
  try {
    await loadAboutContent();
    renderAboutSideSummaries();
  } catch (err) {
    console.warn('About puzzle content failed to load', err);
  }

  document.querySelectorAll('.about-puzzle-piece[data-about-key]').forEach((btn) => {
    btn.addEventListener('click', () => openAboutModal(btn.dataset.aboutKey));
  });

  document.getElementById('aboutModalClose')?.addEventListener('click', closeAboutModal);
  document.getElementById('aboutModalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'aboutModalOverlay') closeAboutModal();
  });
}
