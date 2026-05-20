import { useEffect } from 'react';
import { useApp } from '../context/AppProvider';

export function LogoutConfirmModal() {
  const { logoutConfirmOpen, closeLogoutConfirm, confirmLogout } = useApp();

  useEffect(() => {
    if (!logoutConfirmOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      closeLogoutConfirm();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [logoutConfirmOpen, closeLogoutConfirm]);

  if (!logoutConfirmOpen) return null;

  return (
    <div
      className="legal-modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logoutConfirmTitle"
      aria-describedby="logoutConfirmDesc"
      onClick={closeLogoutConfirm}
    >
      <div className="legal-modal logout-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-accent" aria-hidden />
        <div className="logout-confirm-head">
          <div className="logout-confirm-icon" aria-hidden>
            <i className="bi bi-box-arrow-right" />
          </div>
          <h2 id="logoutConfirmTitle">Log out?</h2>
          <p id="logoutConfirmDesc" className="logout-confirm-lede">
            You will be signed out of your TOBC account on this device.
          </p>
        </div>
        <div className="logout-confirm-actions">
          <button type="button" className="btn btn-secondary" onClick={closeLogoutConfirm}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={confirmLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
