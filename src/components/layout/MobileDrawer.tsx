import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';
import type { RoleId } from '../../types';
import { pageFromPath } from '../../lib/routes';

export function MobileDrawer() {
  const { drawerOpen, setDrawerOpen, setRole, navigateTo, openAuthModal, isLoggedIn, user, logout, authSessionReady } =
    useApp();
  const page = pageFromPath(useLocation().pathname);

  if (!drawerOpen) return null;

  const rowClass = (p: string) =>
    `mobile-nav-row${page === p ? ' is-current-route' : ''}`;

  const pickRole = (r: RoleId) => {
    setRole(r);
    setDrawerOpen(false);
  };

  return (
    <div
      className={`mobile-drawer open`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setDrawerOpen(false);
      }}
      role="presentation"
    >
      <div className="mobile-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 19, fontWeight: 800, color: 'var(--teal-800)' }}>
            Menu
          </span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--ink)' }}
          >
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', padding: '6px 0', borderBottom: '1px solid var(--ghost)', marginBottom: 6 }}>
            I am a…
          </div>
          <button type="button" onClick={() => pickRole('seafarer')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <i className="bi bi-anchor" aria-hidden /> Seafarer
          </button>
          <button type="button" onClick={() => pickRole('agency')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <i className="bi bi-building" aria-hidden /> Manning Agency
          </button>
          <button type="button" onClick={() => pickRole('center')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <i className="bi bi-mortarboard-fill" aria-hidden /> Training Center
          </button>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', padding: '6px 0', borderBottom: '1px solid var(--ghost)', margin: '10px 0 6px' }}>
            Pages
          </div>
          {[
            ['home', 'bi-house-door', 'Home'],
            ['courses', 'bi-journal-bookmark', 'Courses'],
            ['partners', 'bi-people', 'Partners'],
            ['about', 'bi-info-circle', 'About Us'],
            ['news', 'bi-newspaper', 'News'],
            ['library', 'bi-book', 'Library'],
            ['help', 'bi-question-circle', 'Help Center'],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              type="button"
              className={rowClass(id)}
              data-nav-page={id}
              onClick={() => navigateTo(id as 'home')}
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: 15,
                fontWeight: 500,
                borderBottom: id === 'help' ? 'none' : '1px solid var(--ghost)',
                color: 'var(--ink)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <i className={`bi ${icon}`} aria-hidden /> {label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {authSessionReady && isLoggedIn ? (
            <>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Signed in as {user?.name}</p>
              <button type="button" className="btn btn-secondary" onClick={() => { setDrawerOpen(false); navigateTo('profile'); }}>Profile</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setDrawerOpen(false); navigateTo('booked-courses'); }}>Booked Courses</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setDrawerOpen(false); navigateTo('messages'); }}>Messages</button>
              <button type="button" className="btn btn-ghost" style={{ justifyContent: 'center' }} onClick={() => { setDrawerOpen(false); logout(); }}>Log out</button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => { setDrawerOpen(false); openAuthModal('register'); }}>Register Free</button>
              <button type="button" className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => { setDrawerOpen(false); openAuthModal('login'); }}>Log In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
