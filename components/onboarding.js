/** First-visit onboarding overlay */

import { getItem, setItem, removeItem } from '../utils/storage.js';

const ONBOARD_KEY = 'tobc_onboarded_v1';

export function hasCompletedOnboarding() {
  return getItem(ONBOARD_KEY) === '1';
}

export function markOnboardingComplete() {
  setItem(ONBOARD_KEY, '1');
}

function clearOnboardingFlag() {
  removeItem(ONBOARD_KEY);
}

function showOnboarding(overlay) {
  overlay.classList.add('open');
  document.documentElement.classList.add('tobc-show-onboard');
  document.body.style.overflow = 'hidden';
}

export function hideOnboarding(overlay) {
  overlay.classList.remove('open');
  document.documentElement.classList.remove('tobc-show-onboard');
  document.body.style.overflow = '';
}

export function initOnboarding() {
  const overlay = document.getElementById('onboardOverlay');
  if (!overlay) return;

  const params = new URLSearchParams(location.search);
  if (params.get('onboard') === 'reset') {
    clearOnboardingFlag();
    params.delete('onboard');
    const qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + location.hash);
  }

  const dismiss = () => {
    hideOnboarding(overlay);
    markOnboardingComplete();
  };
  document.getElementById('onboardDismiss')?.addEventListener('click', dismiss);
  document.getElementById('onboardSkip')?.addEventListener('click', dismiss);

  if (hasCompletedOnboarding()) {
    hideOnboarding(overlay);
    return;
  }

  showOnboarding(overlay);
}
