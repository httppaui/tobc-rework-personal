import type { RoleId } from '../../types';

export function HeroCTAs({
  role,
  onPrimary,
  onSecondary,
}: {
  role: RoleId;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  if (role === 'agency') {
    return (
      <>
        <button type="button" className="btn btn-primary btn--lg" onClick={onPrimary}>
          <i className="bi bi-people-fill" aria-hidden /> Bulk-book for my crew
        </button>
        <button type="button" className="btn btn-secondary btn--lg" onClick={onSecondary}>
          Agency dashboard →
        </button>
      </>
    );
  }
  if (role === 'center') {
    return (
      <>
        <button type="button" className="btn btn-primary btn--lg" onClick={onPrimary}>
          <i className="bi bi-mortarboard-fill" aria-hidden /> Publish courses on TOBC
        </button>
        <button type="button" className="btn btn-secondary btn--lg" onClick={onSecondary}>
          Provider console →
        </button>
      </>
    );
  }
  return (
    <>
      <button type="button" className="btn btn-primary btn--lg" onClick={onPrimary}>
        <i className="bi bi-search" aria-hidden /> Find a course &amp; schedule
      </button>
      <button type="button" className="btn btn-secondary btn--lg" onClick={onSecondary}>
        Create account
      </button>
    </>
  );
}

