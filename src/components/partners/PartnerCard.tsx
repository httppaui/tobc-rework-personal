import type { KeyboardEvent, MouseEvent } from 'react';
import { useApp } from '../../context/AppProvider';
import type { Partner } from '../../data/partners';

function PartnerBadges({ partner }: { partner: Partner }) {
  return (
    <>
      <span
        className={`badge ${partner.category === 'industry' ? 'badge-amber' : 'badge-teal'}`}
      >
        {partner.categoryLabel}
      </span>
      {partner.category === 'business' ? (
        <span className={`badge ${partner.badgeClass}`}>{partner.typeLabel}</span>
      ) : null}
      {partner.courses ? (
        <span className="badge badge-green">{partner.courses} Courses</span>
      ) : null}
    </>
  );
}

export function PartnerCard({ partner, listMode }: { partner: Partner; listMode?: boolean }) {
  const { toast, openPartnerDetail } = useApp();
  const isBusiness = partner.category === 'business';

  const handleVisit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toast(`Opening ${partner.name} website…`, 'info');
  };

  const openDetail = () => {
    if (isBusiness) openPartnerDetail(partner.id);
  };

  const onCardKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!isBusiness) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail();
    }
  };

  const visitBtn = (
    <button
      type="button"
      className="btn btn-secondary btn--sm partner-visit-btn"
      onClick={handleVisit}
    >
      Visit Site <i className="bi bi-box-arrow-up-right" aria-hidden />
    </button>
  );

  const businessHint = isBusiness ? (
    <span className="partner-card-open-hint">
      View profile <i className="bi bi-chevron-right" aria-hidden />
    </span>
  ) : null;

  if (listMode) {
    return (
      <article
        className={`partner-card list-mode${isBusiness ? ' partner-card--interactive' : ''}`}
        data-category={partner.category}
        data-type={partner.type}
        tabIndex={isBusiness ? 0 : undefined}
        role={isBusiness ? 'button' : undefined}
        onClick={isBusiness ? openDetail : undefined}
        onKeyDown={onCardKeyDown}
        aria-label={isBusiness ? `View profile for ${partner.name}` : undefined}
      >
        <div className="partner-card-logo">
          <i className={`bi ${partner.icon}`} aria-hidden />
        </div>
        <div className="partner-card-content">
          <h3 className="partner-card-name">{partner.name}</h3>
          <p className="partner-card-desc">{partner.description}</p>
        </div>
        <div className="partner-list-actions">
          <div className="partner-card-badges--list">
            <PartnerBadges partner={partner} />
          </div>
          {isBusiness ? businessHint : visitBtn}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`partner-card${isBusiness ? ' partner-card--interactive' : ''}`}
      data-category={partner.category}
      data-type={partner.type}
      tabIndex={isBusiness ? 0 : undefined}
      role={isBusiness ? 'button' : undefined}
      onClick={isBusiness ? openDetail : undefined}
      onKeyDown={onCardKeyDown}
      aria-label={isBusiness ? `View profile for ${partner.name}` : undefined}
    >
      <div className="partner-card-main">
        <div className="partner-card-logo">
          <i className={`bi ${partner.icon}`} aria-hidden />
        </div>
        <div className="partner-card-info">
          <h3 className="partner-card-name">{partner.name}</h3>
          <p>{partner.description}</p>
        </div>
      </div>
      <div className="partner-card-meta">
        <PartnerBadges partner={partner} />
      </div>
      {isBusiness ? businessHint : visitBtn}
    </article>
  );
}
