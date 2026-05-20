import { useEffect, useState } from 'react';
import { useApp } from '../context/AppProvider';
import { applyA11yPrefs, loadA11yPrefs, saveA11yPrefs, type A11yPrefs } from '../lib/accessibility';

export function AccessibilityModal() {
  const { accessibilityOpen, closeAccessibilityPanel, toast } = useApp();
  const [prefs, setPrefs] = useState<A11yPrefs>(() => loadA11yPrefs());

  useEffect(() => {
    if (!accessibilityOpen) return;
    setPrefs(loadA11yPrefs());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAccessibilityPanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [accessibilityOpen, closeAccessibilityPanel]);

  if (!accessibilityOpen) return null;

  const update = (patch: Partial<A11yPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    saveA11yPrefs(next);
    applyA11yPrefs(next);
  };

  const onSave = () => {
    saveA11yPrefs(prefs);
    applyA11yPrefs(prefs);
    toast('Display preferences saved', 'success');
    closeAccessibilityPanel();
  };

  return (
    <div
      className="legal-overlay open"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAccessibilityPanel();
      }}
    >
      <div
        className="legal-modal a11y-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11yModalTitle"
      >
        <div className="legal-modal-head">
          <div>
            <h2 id="a11yModalTitle">Display &amp; accessibility</h2>
            <p className="a11y-modal-lede">Saved on this device. Applies across TOBC pages.</p>
          </div>
          <button type="button" className="legal-modal-close" onClick={closeAccessibilityPanel} aria-label="Close">
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        <div className="legal-modal-body a11y-modal-body">
          <label className="a11y-toggle">
            <input
              type="checkbox"
              checked={prefs.reducedMotion}
              onChange={(e) => update({ reducedMotion: e.target.checked })}
            />
            <span className="a11y-toggle-text">
              <strong>Reduce motion</strong>
              <span>Minimize animations and transitions (helpful if you are sensitive to movement).</span>
            </span>
          </label>
          <label className="a11y-toggle">
            <input
              type="checkbox"
              checked={prefs.largeText}
              onChange={(e) => update({ largeText: e.target.checked })}
            />
            <span className="a11y-toggle-text">
              <strong>Larger text</strong>
              <span>Increases base font size for easier reading.</span>
            </span>
          </label>
          <p className="a11y-modal-note" role="note">
            Your browser may also respect system <em>prefers-reduced-motion</em> settings.
          </p>
        </div>
        <div className="legal-modal-foot">
          <button type="button" className="btn btn-primary" onClick={onSave}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
