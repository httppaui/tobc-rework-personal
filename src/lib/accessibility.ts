export type A11yPrefs = {
  reducedMotion: boolean;
  largeText: boolean;
};

const STORAGE_KEY = 'tobc_a11y_prefs';

const DEFAULT_PREFS: A11yPrefs = {
  reducedMotion: false,
  largeText: false,
};

export function loadA11yPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw) as Partial<A11yPrefs>;
    return {
      reducedMotion: !!parsed.reducedMotion,
      largeText: !!parsed.largeText,
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function saveA11yPrefs(prefs: A11yPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore quota / private mode */
  }
}

export function applyA11yPrefs(prefs: A11yPrefs): void {
  const root = document.documentElement;
  root.classList.toggle('tobc-reduced-motion', prefs.reducedMotion);
  root.classList.toggle('tobc-large-text', prefs.largeText);
}
