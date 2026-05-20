import type { MouseEvent } from 'react';
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
  const { toast } = useApp();

  const handleVisit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toast(`Opening ${partner.name} website…`, 'info');
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

  if (listMode) {
    return (
      <article
        className="partner-card list-mode"
        data-category={partner.category}
        data-type={partner.type}
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
          {visitBtn}
        </div>
      </article>
    );
  }

  return (
    <article className="partner-card" data-category={partner.category} data-type={partner.type}>
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
      {visitBtn}
    </article>
  );
}
