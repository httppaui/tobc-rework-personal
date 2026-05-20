import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppProvider';

function formatNotifTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function NotificationBell() {
  const { notifications, unreadNotificationCount, markAllNotificationsRead, navigateTo } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    markAllNotificationsRead();
  }, [open, markAllNotificationsRead]);

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

  return (
    <div className={`nav-notify-wrap${open ? ' is-open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className="nav-icon-btn"
        aria-label={`Notifications${unreadNotificationCount ? `, ${unreadNotificationCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <i className="bi bi-bell" aria-hidden />
        {unreadNotificationCount > 0 ? (
          <span className="nav-badge">{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</span>
        ) : null}
      </button>

      <div className="nav-notify-panel" role="menu">
        <div className="nav-notify-head">
          <strong>Notifications</strong>
          <span className="nav-notify-count">{notifications.length}</span>
        </div>
        <div className="nav-notify-list">
          {notifications.length === 0 ? (
            <p className="nav-notify-empty">No notifications yet. Booking confirmations will appear here.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`nav-notify-item${n.read ? '' : ' is-unread'}`} role="menuitem">
                <div className="nav-notify-item-title">{n.title}</div>
                <p className="nav-notify-item-body">{n.body}</p>
                <span className="nav-notify-item-time">{formatNotifTime(n.createdAt)}</span>
              </div>
            ))
          )}
        </div>
        <div className="nav-notify-footer">
          <button type="button" className="btn btn-secondary btn--sm" onClick={() => { navigateTo('booked-courses'); setOpen(false); }}>
            Booked courses
          </button>
          <button type="button" className="btn btn-secondary btn--sm nav-notify-close-only" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
