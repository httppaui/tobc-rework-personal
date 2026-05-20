import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartnersFilters } from '../components/partners/PartnersFilters';
import { PARTNERS, PARTNERS_TOTAL } from '../data/partners';
import { useApp } from '../context/AppProvider';
import {
  DEFAULT_PARTNER_FILTERS,
  filterPartners,
  type PartnerSidebarFilters,
} from '../lib/partnerFilters';
import { EmptyResults } from '../components/EmptyResults';

function normalizePartnerType(type: string): string {
  if (type === 'review') return 'pdos';
  return type;
}

const TYPE_TAB_LABELS: Record<string, string> = {
  all: 'All Partners',
  training: 'Training Center',
  school: 'School',
  assessment: 'Assessment Center',
  pdos: 'PDOS Reviewer',
  others: 'Others',
};

export function PartnersPage() {
  const { navigateTo, toast } = useApp();
  const [params] = useSearchParams();
  const [searchQ, setSearchQ] = useState('');
  const [toolbarType, setToolbarType] = useState(() => params.get('type') ?? 'all');
  const [sidebar, setSidebar] = useState<PartnerSidebarFilters>(DEFAULT_PARTNER_FILTERS);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    const raw = params.get('type');
    if (raw) {
      const type = normalizePartnerType(raw);
      setToolbarType(type);
      setSidebar((prev) => ({
        ...prev,
        types: prev.types.length ? prev.types : [type],
      }));
    }
  }, [params]);

  useEffect(() => {
    setFiltering(true);
    const t = window.setTimeout(() => setFiltering(false), 220);
    return () => window.clearTimeout(t);
  }, [searchQ, toolbarType, sidebar]);

  const filtered = useMemo(
    () => filterPartners(PARTNERS, { searchQ, toolbarType, sidebar }),
    [searchQ, toolbarType, sidebar],
  );

  const clearFilters = () => {
    setSearchQ('');
    setToolbarType('all');
    setSidebar(DEFAULT_PARTNER_FILTERS);
    toast('All filters cleared', 'info');
  };

  const handleSidebarChange = (next: PartnerSidebarFilters) => {
    setSidebar(next);
    if (next.types.length === 1) setToolbarType(next.types[0]);
    else if (next.types.length === 0) setToolbarType('all');
    else setToolbarType('all');
  };

  const setTypeTab = (type: string) => {
    setToolbarType(type);
    setSidebar((prev) => ({
      ...prev,
      types: type === 'all' ? [] : [type],
      othersSpecify: type === 'others' ? prev.othersSpecify : '',
    }));
  };

  return (
    <>
      <div className="partners-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => navigateTo('home')}>
              Home
            </button>
            <span className="sep">/</span>
            <span className="current" aria-current="page">
              Partners
            </span>
          </nav>
          <h1>Our Industry Partners</h1>
          <p>
            84+ MARINA-accredited training centers, assessment centers, manning agencies, and industry
            organizations on TOBC.
          </p>
        </div>
      </div>

      <div className="partners-filter-bar">
        <div className="container">
          <div className="partner-type-tabs">
            {Object.entries(TYPE_TAB_LABELS).map(([type, label]) => (
              <button
                key={type}
                type="button"
                className={`partner-type-tab${toolbarType === type ? ' active' : ''}`}
                onClick={() => setTypeTab(type)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="courses-layout partners-layout">
            <PartnersFilters filters={sidebar} onFiltersChange={handleSidebarChange} onClear={clearFilters} />

            <div
              className={`courses-results-panel${filtering ? ' is-filtering' : ''}`}
              id="partnersResultsPanel"
            >
              <div className="results-header">
                <div className="results-count">
                  Showing <strong>{filtered.length}</strong> of <strong>{PARTNERS_TOTAL}</strong> partners
                </div>
                <div className="cs-input-wrap" style={{ maxWidth: 260 }}>
                  <i className="bi bi-search cs-input-icon" aria-hidden />
                  <input
                    className="cs-input"
                    type="search"
                    placeholder="Search partners…"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                  />
                </div>
              </div>

              <div className="partners-grid" id="partnersGrid">
                {filtered.map((p) => (
                  <article key={p.id} className="partner-card" data-type={p.type}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div className="partner-card-logo">
                        <i className={`bi ${p.icon}`} aria-hidden />
                      </div>
                      <div className="partner-card-info">
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                      </div>
                    </div>
                    <div className="partner-card-meta">
                      <span className={`badge ${p.badgeClass}`}>{p.typeLabel}</span>
                      {p.courses ? (
                        <span className="badge badge-green">{p.courses} Courses</span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn--sm partner-visit-btn"
                      onClick={() => toast(`Opening ${p.name}…`, 'info')}
                    >
                      Visit Site →
                    </button>
                  </article>
                ))}
              </div>

              {filtered.length === 0 && (
                <EmptyResults
                  iconClass="bi-building"
                  title="No partners match your filters"
                  description="Try clearing filters or broadening your search."
                  actionLabel="Clear filters"
                  onAction={clearFilters}
                />
              )}

              {filtered.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => toast('Loading more partners…', 'info')}
                  >
                    Load More Partners
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="cta-banner">
        <div className="container">
          <span className="section-eyebrow" style={{ color: 'var(--teal-200)' }}>
            Join TOBC
          </span>
          <h2 style={{ color: '#fff', marginBottom: 10 }}>Become a TOBC Partner</h2>
          <p style={{ color: 'rgba(255,255,255,.88)', margin: '0 auto 24px', maxWidth: 460 }}>
            List your training center and reach 12,400+ active seafarers.
          </p>
          <button
            type="button"
            className="btn btn-amber btn--lg"
            onClick={() => toast('Opening partner registration…', 'success')}
          >
            Apply as Partner →
          </button>
        </div>
      </div>
    </>
  );
}
