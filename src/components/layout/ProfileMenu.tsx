import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';
import { PAGE_PATHS } from '../../lib/routes';

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileMenu() {
  const { user, logout, navigateTo, openAccessibilityPanel } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        close();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open, close]);

  if (!user) return null;

  const firstName = user.name.split(' ')[0] || user.name;
  const initials = userInitials(user.name);

  const run = (action: () => void) => {
    close();
    action();
  };

  return (
    <div className={`nav-profile-menu${open ? ' is-open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className="nav-profile-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-profile-avatar" aria-hidden>
          {initials}
        </span>
        <span className="nav-profile-name">{firstName}</span>
        <i className={`bi bi-chevron-down nav-profile-chevron${open ? ' is-up' : ''}`} aria-hidden />
      </button>

      <div className="nav-profile-dropdown" role="menu">
        <div className="nav-profile-dropdown-head">
          <span className="nav-profile-dropdown-name">{user.name}</span>
          <span className="nav-profile-dropdown-email">{user.email}</span>
        </div>

        <button
          type="button"
          className="nav-profile-dropdown-item"
          role="menuitem"
          onClick={() => run(() => navigateTo('profile'))}
        >
          <i className="bi bi-person" aria-hidden />
          Profile
        </button>
        <button
          type="button"
          className="nav-profile-dropdown-item"
          role="menuitem"
          onClick={() => run(() => navigateTo('settings'))}
        >
          <i className="bi bi-gear" aria-hidden />
          Settings &amp; privacy
        </button>
        <div className="nav-profile-help-row" role="presentation">
          <button
            type="button"
            className="nav-profile-dropdown-item nav-profile-help-main"
            role="menuitem"
            onClick={() => run(() => navigateTo('help'))}
          >
            <i className="bi bi-life-preserver" aria-hidden />
            Help &amp; support
          </button>
          <Link
            to={PAGE_PATHS.help}
            className="nav-profile-item-hint"
            role="menuitem"
            onClick={close}
          >
            Help center
          </Link>
        </div>
        <button
          type="button"
          className="nav-profile-dropdown-item"
          role="menuitem"
          onClick={() => run(openAccessibilityPanel)}
        >
          <i className="bi bi-universal-access" aria-hidden />
          Display &amp; accessibility
        </button>

        <div className="nav-profile-dropdown-divider" role="separator" />

        <button
          type="button"
          className="nav-profile-dropdown-item nav-profile-logout"
          role="menuitem"
          onClick={() => run(logout)}
        >
          <i className="bi bi-box-arrow-right" aria-hidden />
          Log out
        </button>
      </div>
    </div>
  );
}


