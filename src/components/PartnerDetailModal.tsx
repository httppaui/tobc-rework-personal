import { useEffect, useId, useState, type ReactNode } from 'react';
import { useApp } from '../context/AppProvider';
import {
  PARTNER_DETAIL_TABS,
  getBusinessPartnerProfile,
  type PartnerDetailTabId,
} from '../data/partnerCatalog';
import { PARTNERS } from '../data/partners';

function formatDetailText(text: string) {
  return text.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('•')) {
      const items = trimmed.split('\n').map((line) => line.replace(/^•\s*/, '').trim());
      return (
        <ul key={i} className="course-detail-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="course-detail-desc">
        {trimmed}
      </p>
    );
  });
}

export function PartnerDetailModal() {
  const { partnerDetailId, closePartnerDetail, toast } = useApp();
  const tabListId = useId();
  const [activeTab, setActiveTab] = useState<PartnerDetailTabId>('about');

  useEffect(() => {
    setActiveTab('about');
  }, [partnerDetailId]);

  if (!partnerDetailId) return null;

  const partner = PARTNERS.find((p) => p.id === partnerDetailId);
  const profile = getBusinessPartnerProfile(partnerDetailId);
  if (!partner || partner.category !== 'business' || !profile) return null;

  const panelContent: Record<PartnerDetailTabId, ReactNode> = {
    about: formatDetailText(profile.about),
    contact: (
      <dl className="partner-detail-dl">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
          </dd>
        </div>
        {profile.hours ? (
          <div>
            <dt>Office hours</dt>
            <dd>{profile.hours}</dd>
          </div>
        ) : null}
      </dl>
    ),
    address: (
      <>
        <p className="course-detail-desc">{profile.address}</p>
        <p className="course-detail-desc">
          <i className="bi bi-geo-alt" aria-hidden /> Listed service area: {partner.city.replace('metro-', 'Metro ')}
        </p>
      </>
    ),
    cancellation: formatDetailText(profile.cancellationPolicy),
    gallery: (
      <div className="partner-detail-gallery" role="list">
        {profile.gallery.map((item) => (
          <figure key={item.id} className="partner-detail-gallery-item" role="listitem">
            <div className="partner-detail-gallery-img" style={{ background: item.gradient }} aria-hidden />
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    ),
  };

  const openWebsite = () => {
    window.open(profile.websiteUrl, '_blank', 'noopener,noreferrer');
    toast(`Opening ${partner.name} website…`, 'info');
  };

  return (
    <div
      className="course-detail-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePartnerDetail();
      }}
      role="presentation"
    >
      <div
        className="course-detail-modal partner-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="partnerDetailTitle"
      >
        <div className="course-detail-head">
          <div>
            <span className={`badge ${partner.badgeClass}`}>{partner.typeLabel}</span>
            <h2 id="partnerDetailTitle">{partner.name}</h2>
            <p className="course-detail-provider">{partner.description}</p>
          </div>
          <button type="button" onClick={closePartnerDetail} aria-label="Close">
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        <div className="course-detail-body">
          <div className="course-detail-hero partner-detail-hero">
            <i className={`bi ${partner.icon}`} aria-hidden />
          </div>
          <div className="course-detail-meta">
            {partner.courses ? (
              <span>
                <i className="bi bi-journal-bookmark" aria-hidden /> {partner.courses} courses on TOBC
              </span>
            ) : null}
            <span>
              <i className="bi bi-building" aria-hidden /> Business partner
            </span>
          </div>

          <div className="course-detail-tabs-wrap">
            <div className="course-detail-tabs" role="tablist" aria-label="Partner information" id={tabListId}>
              {PARTNER_DETAIL_TABS.map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`${tabListId}-${tab.id}`}
                    className={`course-detail-tab${selected ? ' is-active' : ''}`}
                    aria-selected={selected}
                    aria-controls={`${tabListId}-panel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {PARTNER_DETAIL_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                id={`${tabListId}-panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`${tabListId}-${tab.id}`}
                hidden={!selected}
                className="course-detail-panel"
              >
                {selected ? panelContent[tab.id] : null}
              </div>
            );
          })}
        </div>
        <div className="course-detail-footer partner-detail-footer">
          <button
            type="button"
            className="course-detail-btn course-detail-btn--primary"
            onClick={openWebsite}
          >
            <i className="bi bi-box-arrow-up-right" aria-hidden />
            <span>View website</span>
          </button>
        </div>
      </div>
    </div>
  );
}
