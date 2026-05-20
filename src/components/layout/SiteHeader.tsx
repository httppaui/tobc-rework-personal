import { useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';
import { NavDropdown, NavDropdownItem } from './NavDropdown';
import { ProfileMenu } from './ProfileMenu';
import type { RoleId } from '../../types';
import { ROLE_PATHS } from '../../data/rolePaths';
import { PAGE_PATHS, pageFromPath } from '../../lib/routes';

const ROLES: { id: RoleId; label: string }[] = [
  { id: 'seafarer', label: 'Seafarer' },
  { id: 'agency', label: 'Manning Agency' },
  { id: 'center', label: 'Training Center' },
];

export function SiteHeader() {
  const {
    role,
    setRole,
    setDrawerOpen,
    navigateTo,
    cartIds,
    wishlistIds,
    openAuthModal,
    isLoggedIn,
    authSessionReady,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const page = pageFromPath(location.pathname);
  const [query, setQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelDropdownClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleDropdownClose = useCallback(() => {
    cancelDropdownClose();
    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 140);
  }, [cancelDropdownClose]);

  const openDropdownMenu = useCallback(
    (id: string) => {
      cancelDropdownClose();
      setOpenDropdown(id);
    },
    [cancelDropdownClose],
  );

  const goTo = useCallback(
    (path: string) => {
      setOpenDropdown(null);
      setDrawerOpen(false);
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [navigate, setDrawerOpen],
  );

  const goCourses = useCallback(
    (filter?: string) => {
      const search = filter ? `?filter=${encodeURIComponent(filter)}` : '';
      goTo(`${PAGE_PATHS.courses}${search}`);
    },
    [goTo],
  );

  const runGlobalSearch = () => {
    const q = query.trim();
    navigate(PAGE_PATHS.courses);
    if (q) {
      navigate(`${PAGE_PATHS.courses}?q=${encodeURIComponent(q)}`);
    }
  };

  const switchRole = (next: RoleId) => {
    setRole(next);
  };

  const rolePathAction = (action: string) => {
    switch (action) {
      case 'courses':
        navigateTo('courses');
        break;
      case 'partners-training':
        navigate(`${PAGE_PATHS.partners}?type=training`);
        break;
      case 'faq':
        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const navClass = (p: typeof page) => `nav-link${page === p ? ' active-page' : ''}`;

  return (
    <>
      <div className="nav-wrapper">
        <div className="nav-container">
          <nav className="nav">
            <div className="nav-start">
              <button
                type="button"
                className="nav-logo"
                onClick={() => navigateTo('home')}
                aria-label="TOBC home"
              >
                <img
                  src="/tobc-logo.png"
                  alt="TOBC — The Online Booking Corp."
                  className="nav-logo-img"
                  width={180}
                  height={60}
                  decoding="async"
                />
              </button>
              <div className="nav-role-tabs">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`nav-role-tab${role === r.id ? ' active' : ''}`}
                    data-role={r.id}
                    onClick={() => switchRole(r.id)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="nav-links">
              <NavDropdown
                id="courses"
                label="Courses"
                navClassName={navClass('courses')}
                isOpen={openDropdown === 'courses'}
                onOpen={() => openDropdownMenu('courses')}
                onScheduleClose={scheduleDropdownClose}
                onCancelClose={cancelDropdownClose}
                onMainClick={() => goCourses()}
              >
                <NavDropdownItem label="STCW Courses" onSelect={() => goCourses('stcw')} />
                <NavDropdownItem label="Non-STCW Courses" onSelect={() => goCourses('non-stcw')} />
                <NavDropdownItem label="Assessment" onSelect={() => goCourses('assessment')} />
                <NavDropdownItem label="TESDA / PDOS" onSelect={() => goCourses('tesda')} />
                <NavDropdownItem label="Offshore / Cruise" onSelect={() => goCourses('offshore')} />
              </NavDropdown>
              <NavDropdown
                id="partners"
                label="Partners"
                navClassName={navClass('partners')}
                isOpen={openDropdown === 'partners'}
                onOpen={() => openDropdownMenu('partners')}
                onScheduleClose={scheduleDropdownClose}
                onCancelClose={cancelDropdownClose}
                onMainClick={() => goTo(PAGE_PATHS.partners)}
              >
                <NavDropdownItem label="Training Centers" onSelect={() => goTo(`${PAGE_PATHS.partners}?type=training`)} />
                <NavDropdownItem label="Assessment Centers" onSelect={() => goTo(`${PAGE_PATHS.partners}?type=assessment`)} />
                <NavDropdownItem label="Review Centers" onSelect={() => goTo(`${PAGE_PATHS.partners}?type=review`)} />
                <NavDropdownItem label="Schools" onSelect={() => goTo(`${PAGE_PATHS.partners}?type=school`)} />
                <NavDropdownItem label="PDOS Providers" onSelect={() => goTo(`${PAGE_PATHS.partners}?type=pdos`)} />
              </NavDropdown>
              <button type="button" className={navClass('about')} onClick={() => navigateTo('about')}>
                About Us
              </button>
              <NavDropdown
                id="news"
                label="News"
                navClassName={navClass('news')}
                isOpen={openDropdown === 'news'}
                onOpen={() => openDropdownMenu('news')}
                onScheduleClose={scheduleDropdownClose}
                onCancelClose={cancelDropdownClose}
                onMainClick={() => goTo(PAGE_PATHS.news)}
              >
                <NavDropdownItem label="TOBC Company News" onSelect={() => goTo(PAGE_PATHS.news)} />
                <NavDropdownItem label="Maritime Industry Updates" onSelect={() => goTo(PAGE_PATHS.news)} />
                <NavDropdownItem label="Maritime Events" onSelect={() => goTo(PAGE_PATHS.news)} />
                <NavDropdownItem label="Partner News" onSelect={() => goTo(PAGE_PATHS.news)} />
              </NavDropdown>
              <button type="button" className={navClass('library')} onClick={() => navigateTo('library')}>
                Library
              </button>
            </div>

            <div className="nav-actions">
              <button
                type="button"
                className="nav-icon-btn"
                onClick={() => navigateTo('courses')}
                aria-label="Search courses"
              >
                <i className="bi bi-search" aria-hidden />
              </button>
              <button
                type="button"
                className="nav-icon-btn"
                aria-label={`Cart${cartIds.length ? `, ${cartIds.length} items` : ''}`}
                onClick={() => navigateTo('cart')}
              >
                <i className="bi bi-cart3" aria-hidden />
                {cartIds.length > 0 && <span className="nav-badge">{cartIds.length}</span>}
              </button>
              <button
                type="button"
                className="nav-icon-btn"
                aria-label={`Wishlist${wishlistIds.length ? `, ${wishlistIds.length} items` : ''}`}
                onClick={() => navigateTo('wishlist')}
              >
                <i className="bi bi-heart" aria-hidden />
                {wishlistIds.length > 0 && <span className="nav-badge">{wishlistIds.length}</span>}
              </button>
              <button
                type="button"
                className="nav-icon-btn"
                aria-label="Messages"
                onClick={() => navigateTo('messages')}
              >
                <i className="bi bi-chat-dots" aria-hidden />
                <span className="dot" />
              </button>
              <div className="nav-divider" />
              {!authSessionReady ? null : isLoggedIn ? (
                <ProfileMenu />
              ) : (
                <>
                  <button type="button" className="btn btn-secondary btn--sm" onClick={() => openAuthModal('login')}>
                    Log In
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn--sm"
                    onClick={() => openAuthModal('register')}
                  >
                    Register Free
                  </button>
                </>
              )}
              <button type="button" className="nav-mobile-toggle" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <span />
                <span />
                <span />
              </button>
            </div>
          </nav>
        </div>
      </div>

      <div className="global-search-bar" id="globalSearchBar">
        <div className="container global-search-inner">
          <label className="visually-hidden" htmlFor="globalSearchQ">
            Search courses by name or keyword
          </label>
          <input
            type="search"
            id="globalSearchQ"
            className="global-search-input"
            placeholder="Search 320+ MARINA-accredited courses…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                runGlobalSearch();
              }
            }}
          />
          <button type="button" className="btn btn-primary btn--sm" id="globalSearchBtn" onClick={runGlobalSearch}>
            Search courses
          </button>
          <span className="global-search-hint">
            Fills the course search on the Courses page, then runs the search.
          </span>
        </div>
      </div>

      <div className="role-quick-bar">
        <div className="container role-quick-inner">
          <span className="role-quick-label" id="roleQuickLabel">
            {ROLE_PATHS[role].label}
          </span>
          <nav className="role-quick-links" id="navRolePaths" aria-label="Shortcuts for your role">
            {ROLE_PATHS[role].links.map((link) => (
              <button
                key={link.label}
                type="button"
                className="role-ql"
                onClick={() => rolePathAction(link.action)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
