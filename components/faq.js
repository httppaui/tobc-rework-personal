/** FAQ accordion */

import { navigate } from '../services/router.js';

export function toggleFaq(item) {
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

export function goToFaq() {
  navigate('home');
  setTimeout(() => {
    const faq = document.getElementById('faq-section');
    if (faq) faq.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 350);
}
