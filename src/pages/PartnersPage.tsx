import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartnersFilters } from '../components/partners/PartnersFilters';
import { PARTNER_CITIES, PARTNER_TYPES } from '../data/partnerFilterOptions';
import { PARTNERS, PARTNERS_TOTAL } from '../data/partners';
import { useApp } from '../context/AppProvider';
import {
  DEFAULT_PARTNER_FILTERS,
  filterPartners,
  type PartnerSidebarFilters,
} from '../lib/partnerFilters';
import { EmptyResults } from '../components/EmptyResults';
import { ResultsSkeleton } from '../components/ResultsSkeleton';

function normalizePartnerType(type: string): string {
  if (type === 'review') return 'pdos';
  return type;
}

type PartnerSortKey = 'name' | 'courses-desc' | 'courses-asc';

export function PartnersPage() {
  const { navigateTo } = useApp();
  const [params] = useSearchParams();
  const [searchQ, setSearchQ] = useState('');
  const [toolbarType, setToolbarType] = useState(() => {
    const raw = params.get('type');
    return raw ? normalizePartnerType(raw) : 'all';
  });
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<PartnerSortKey>('name');
  const [sidebar, setSidebar] = useState<PartnerSidebarFilters>(DEFAULT_PARTNER_FILTERS);
  const [filtering, setFiltering] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

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
  }, [searchQ, toolbarType, sidebar, sort, location]);

  const filtered = useMemo(() => {
    let list = filterPartners(PARTNERS, { searchQ, toolbarType, sidebar });
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'courses-desc':
          return (b.courses ?? 0) - (a.courses ?? 0);
        case 'courses-asc':
          return (a.courses ?? 0) - (b.courses ?? 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchQ, toolbarType, sidebar, sort]);

  const clearFilters = () => {
    setSearchQ('');
    setToolbarType('all');
    setLocation('');
    setSort('name');
    setSidebar(DEFAULT_PARTNER_FILTERS);
  };

  const handleSidebarChange = (next: PartnerSidebarFilters) => {
    setSidebar(next);
    if (next.types.length === 1) setToolbarType(next.types[0]);
    else if (next.types.length === 0) setToolbarType('all');
    else setToolbarType('all');
  };

  const gridClass = view === 'list' ? 'partners-list-view' : 'partners-grid';

  const setToolbarPartnerType = (type: string) => {
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

      <div className="courses-search-bar partners-search-bar">
        <div className="container">
          <div className="courses-search-inner">
            <div className="cs-input-wrap">
              <i className="bi bi-search cs-input-icon" aria-hidden />
              <input
                className="cs-input"
                type="search"
                id="partnerSearchQ"
                placeholder="Search partner name or keyword…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                aria-label="Search partners"
              />
            </div>
            <select
              className="cs-select"
              id="psType"
              value={toolbarType}
              onChange={(e) => setToolbarPartnerType(e.target.value)}
            >
              <option value="all">All Partner Types</option>
              {PARTNER_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className="cs-select"
              id="psSort"
              value={sort}
              onChange={(e) => setSort(e.target.value as PartnerSortKey)}
              style={{ minWidth: 160 }}
            >
              <option value="name">Sort: Partner Name</option>
              <option value="courses-desc">Most courses listed</option>
              <option value="courses-asc">Fewest courses listed</option>
            </select>
            <select
              className="cs-select"
              id="psLoc"
              value={location}
              onChange={(e) => {
                const val = e.target.value;
                setLocation(val);
                setSidebar((prev) => ({
                  ...prev,
                  cities: val ? [val] : [],
                }));
              }}
              style={{ minWidth: 130 }}
            >
              <option value="">All Locations</option>
              {PARTNER_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="partners-page-body">
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
                <div className="results-header-actions">
                  <div className="view-toggle">
                    <button
                      type="button"
                      className={`view-btn${view === 'grid' ? ' active' : ''}`}
                      title="Grid view"
                      aria-pressed={view === 'grid'}
                      onClick={() => setView('grid')}
                    >
                      <i className="bi bi-grid-3x3-gap-fill" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className={`view-btn${view === 'list' ? ' active' : ''}`}
                      title="List view"
                      aria-pressed={view === 'list'}
                      onClick={() => setView('list')}
                    >
                      <i className="bi bi-list-ul" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>

              {!filtering && filtered.length > 0 ? (
                <div className={gridClass} id="partnersGrid">
                  {filtered.map((p) => (
                    <article
                      key={p.id}
                      className={`partner-card${view === 'list' ? ' list-mode' : ''}`}
                      data-type={p.type}
                    >
                      <div className="partner-card-main">
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
                      <button type="button" className="btn btn-secondary btn--sm partner-visit-btn">
                        Visit Site →
                      </button>
                    </article>
                  ))}
                </div>
              ) : null}

              {filtering ? (
                <ResultsSkeleton
                  variant={view === 'list' ? 'partners-list' : 'partners'}
                  count={6}
                />
              ) : null}

              {!filtering && filtered.length === 0 ? (
                <EmptyResults
                  iconClass="bi-building"
                  title="No partners match your filters"
                  description="Try clearing filters or broadening your search."
                  actionLabel="Clear all filters"
                  onAction={clearFilters}
                />
              ) : null}

              {!filtering && filtered.length > 0 ? (
                <div className="partners-load-more">
                  <button type="button" className="btn btn-secondary">
                    Load More Partners
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

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
            className="btn btn-primary btn--lg"
          >
            Apply as Partner →
          </button>
        </div>
      </div>
    </>
  );
}
