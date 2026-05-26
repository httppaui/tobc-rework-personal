import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';
import { pageFromPath } from '../../lib/routes';

export function MobileBottomNav() {
  const { navigateTo } = useApp();
  const page = pageFromPath(useLocation().pathname);

  const itemClass = (p: string) => `mbn-item${page === p ? ' active' : ''}`;

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary mobile" data-tour="mobile-nav">
      <div className="mbn-grid">
        <button type="button" className={itemClass('home')} data-mbn-page="home" onClick={() => navigateTo('home')}>
          <span className="mbn-icon">
            <i className="bi bi-house-door-fill" aria-hidden />
          </span>
          Home
        </button>
        <button
          type="button"
          className={itemClass('courses')}
          data-mbn-page="courses"
          data-tour="mobile-courses"
          onClick={() => navigateTo('courses')}
        >
          <span className="mbn-icon">
            <i className="bi bi-search" aria-hidden />
          </span>
          Courses
        </button>
        <button type="button" className={itemClass('partners')} data-mbn-page="partners" onClick={() => navigateTo('partners')}>
          <span className="mbn-icon">
            <i className="bi bi-people-fill" aria-hidden />
          </span>
          Partners
        </button>
        <button
          type="button"
          className={itemClass('profile')}
          data-mbn-page="profile"
          onClick={() => navigateTo('profile')}
        >
          <span className="mbn-icon">
            <i className="bi bi-person-fill" aria-hidden />
          </span>
          Profile
        </button>
      </div>
    </nav>
  );
}
